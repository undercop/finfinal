import axios from 'axios';
import { mockDashboardData, mockTransactions, mockStockData, mockHoldings } from '../data/mock';

const USE_REAL_API = true;
const BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: BASE_URL,
});

// --- API FUNCTIONS ---

// 1. DASHBOARD DATA
export const getDashboardData = async () => {
  if (!USE_REAL_API) return mockDashboardData;

  try {
    // 1. Fetch Summary, Assets (for Category), AND Holdings (for Real Quantity)
    const [summaryRes, assetsRes, holdingsRes] = await Promise.all([
      api.get('/portfolio/summary'),
      api.get('/assets'),
      api.get('/holdings')
    ]);

    const assets = assetsRes.data || [];
    const holdings = holdingsRes.data || [];

    // 2. Create a Map of Assets to easily find the Category
    // Format: { 1: "STOCK", 2: "GOLD_ETF" }
    const assetCategoryMap = {};
    assets.forEach(asset => {
      assetCategoryMap[asset.id] = asset.category || "Other";
    });

    // 3. Calculate Diversification using HOLDINGS (The source of truth)
    const categoryMap = {};

    holdings.forEach(holding => {
      // Use the Quantity from the HOLDING table (Correct)
      // Use the Price from the HOLDING response (Correct)
      const value = holding.currentPrice * holding.quantity;

      // Look up the category using the Asset ID
      const assetId = holding.assetId;
      const cat = assetCategoryMap[assetId] || "Other";

      if (!categoryMap[cat]) categoryMap[cat] = 0;
      categoryMap[cat] += value;
    });

    const diversificationData = Object.keys(categoryMap).map((cat, index) => ({
      name: cat,
      value: categoryMap[cat],
      color: index === 0 ? '#3b82f6' : index === 1 ? '#10b981' : '#f59e0b'
    }));

    return {
      user: {
        name: "Raj",
        balance: summaryRes.data.totalPortfolioValue,
      },
      summary: {
        totalPortfolioValue: summaryRes.data.totalPortfolioValue,
        oneDayReturn: summaryRes.data.oneDayReturn,
        oneDayReturnValue: summaryRes.data.oneDayReturnValue,
        projectedValue: summaryRes.data.projectedValue || 0,
      },
      diversification: diversificationData,
      alerts: mockDashboardData.alerts
    };

  } catch (error) {
    console.error("Error fetching dashboard:", error);
    return mockDashboardData;
  }
};

// 2. TRANSACTIONS PAGE (Updated for new Endpoint)
export const getTransactions = async () => {
  if (!USE_REAL_API) return mockTransactions;

  try {
    // Backend now gives us the Asset Name inside the transaction object!
    // Endpoint: GET /api/transactions
    const response = await api.get('/transactions');

    return response.data.map(tx => {
       // Backend sends: { asset: { id: 1, name: "Reliance" }, ... }
       const assetName = tx.asset ? tx.asset.name : "Unknown Asset";
       const totalValue = tx.price * tx.quantity;

       return {
         id: tx.id,
         type: tx.type,
         asset: assetName, // Direct access
         amount: `${tx.quantity} Shares`,
         price: `$${tx.price}`,
         total: `$${totalValue.toLocaleString()}`,
         date: tx.date || "Recent", // Fallback if date is missing
         status: "Completed"
       };
    });

  } catch (error) {
    console.error("Error fetching transactions:", error);
    return mockTransactions;
  }
};

// 3. STOCKS PAGE (Using /api/assets)
/* =========================
   STOCKS (With History Fetch)
========================= */
export const getStocks = async () => {
  if (!USE_REAL_API) return mockStockData;

  try {
    const res = await api.get('/assets');
    const assets = res.data;

    const fullStockData = await Promise.all(assets.map(async (asset) => {
      let historyData = [];
      let changeVal = 0;
      let isPositive = true;

      try {
        // Fetch 365 days of history for this specific asset
        // Endpoint: GET /api/price-history/{id}
        const historyRes = await api.get(`/price-history/${asset.id}`);

        // Map backend data (id, date, price, assetId) to Chart data (day, price)
        historyData = historyRes.data.map(h => ({
           day: h.date, // Assumes date format is "YYYY-MM-DD"
           price: h.price
        }));

        // Calculate Trend based on the last 2 days of history
        if (historyData.length >= 2) {
          const lastPrice = historyData[historyData.length - 1].price;
          const prevPrice = historyData[historyData.length - 2].price;
          changeVal = lastPrice - prevPrice;
          isPositive = changeVal >= 0;
        }
      } catch (e) {
        console.warn(`No history found for asset ID ${asset.id}`);
      }

      return {
        id: asset.id,
        symbol: asset.name.substring(0, 4).toUpperCase(),
        name: asset.name,
        shares: asset.quantity,
        price: asset.currentPrice,
        // If history exists, use calculated change, else 0
        change: changeVal !== 0 ? changeVal.toFixed(2) : "0.00",
        isPositive: isPositive,
        history: historyData
      };
    }));

    return fullStockData;

  } catch (err) {
    console.error('Stocks error:', err);
    return mockStockData;
  }
};
// 4. HOLDINGS PAGE (Updated for /api/holdings)
export const getHoldings = async () => {
  if (!USE_REAL_API) return mockHoldings;

  try {
    // Endpoint: GET /api/holdings
    const response = await api.get('/holdings');

    // Map Backend fields -> Frontend UI fields
    return response.data.map(item => ({
      id: item.assetId,
      symbol: item.assetName.substring(0, 4).toUpperCase(), // Fake symbol logic
      name: item.assetName,
      quantity: item.quantity,
      avgPrice: item.avgBuyPrice, // Use the correct field from backend
      currentPrice: item.currentPrice
      // UI calculates P/L itself using (current - avg) * qty
    }));

  } catch (error) {
    console.error("Error fetching holdings:", error);
    return mockHoldings;
  }
};

// 5. PLACE TRADE (Updated for /api/transactions)
export const placeTrade = async (tradeDetails) => {
  if (!USE_REAL_API) {
    console.log("Mock Trade Executed:", tradeDetails);
    return { success: true, message: "Trade executed (Mock)" };
  }

  try {
    // Endpoint: POST /api/transactions
    // Body: { assetId, type, price, quantity }
    const response = await api.post('/transactions', {
      assetId: tradeDetails.assetId,
      type: tradeDetails.type,
      quantity: tradeDetails.quantity,
      price: tradeDetails.price
    });
    return response.data;
  } catch (error) {
    console.error("Trade failed:", error);
    throw error;
  }
};