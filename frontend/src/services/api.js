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
         price: `₹${tx.price}`,
         total: `₹${totalValue.toLocaleString()}`,
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
        const historyRes = await api.get(`/price-history/${asset.id}`);
        historyData = historyRes.data.map(h => ({
           day: h.date,
           price: h.price
        }));

        if (historyData.length >= 2) {
          const lastPrice = historyData[historyData.length - 1].price;
          const prevPrice = historyData[historyData.length - 2].price;
          changeVal = lastPrice - prevPrice;
          isPositive = changeVal >= 0;
        }
      } catch (e) {
        console.warn(`No history found for asset ID ${asset.id}`);
      }

      // FIX: Ensure 2 decimal places here
      const rawPrice = parseFloat(asset.currentPrice) || 0;

      return {
        id: asset.id,
        symbol: asset.name.substring(0, 4).toUpperCase(),
        name: asset.name,
        shares: asset.quantity,
        price: rawPrice.toFixed(2), // <--- Format strictly to 2 decimals
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
      symbol: item.assetName.substring(0, 4).toUpperCase(),
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

// Add/Update these functions in your api.js

// 1. Fetch a single price (The endpoint you confirmed)
export const getLivePriceForAsset = async (assetId) => {
  try {
    const response = await api.get(`/live-prices/${assetId}`);
    return response.data; // Returns { assetId: 1, price: 2900... }
  } catch (error) {
    console.error(`Failed to fetch price for asset ${assetId}`, error);
    return null;
  }
};

// 2. Helper to fetch MANY prices in parallel
export const getBatchLivePrices = async (assetIds) => {
  // Create an array of promises (one for each ID)
  const promises = assetIds.map(id => getLivePriceForAsset(id));

  // Wait for all to finish
  const results = await Promise.all(promises);

  // Filter out any failed requests (nulls)
  return results.filter(item => item !== null);
};
// 6. INTRADAY PRICES (For Live Graph)
export const getIntradayPrices = async (assetId) => {
  try {
    const res = await api.get(`/intraday-prices/${assetId}`);

    if (!Array.isArray(res.data)) return [];

    return res.data.map(point => {
      let timeLabel = "00:00:00"; // Default fallback

      // SCENARIO 1: "updatedAt": "2026-02-05T09:08:53.088" (Standard ISO)
      if (point.updatedAt && point.updatedAt.includes('T')) {
        const afterT = point.updatedAt.split('T')[1];
        timeLabel = afterT.split('.')[0]; // Result: "09:08:53"
      }
      // SCENARIO 2: "time": "09:08:53" (Direct Time String)
      else if (point.time) {
        timeLabel = point.time;
      }
      // SCENARIO 3: "updatedAt": "09:08:53" (Sometimes backend sends time in updatedAt field)
      else if (point.updatedAt) {
        timeLabel = point.updatedAt;
      }

      return {
        day: timeLabel,
        price: parseFloat(point.price) || 0
      };
    });
  } catch (error) {
    console.error(`Failed to load intraday for ${assetId}`, error);
    return [];
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
// 8. RISK ANALYSIS (New Performance Page)
export const getRiskAnalysis = async () => {
  if (!USE_REAL_API) {
    // Return mock data if API is off
    return {
      categoryExposure: { "STOCK": 44, "MF_LARGE": 23, "MF_SMALL": 12, "GOLD": 10, "Other": 11 },
      dimensionScores: { "concentrationRisk": 0.3, "growthBiasRisk": 0.4, "allocationRisk": 3.2 },
      insights: ["Mock insight: High stock concentration.", "Mock insight: Growth bias detected."],
      riskLabel: "Aggressive",
      riskScore: 3.89,
      summary: "Aggressive portfolio with high growth orientation."
    };
  }

  try {
    const response = await api.get('/ai/risk');
    return response.data;
  } catch (error) {
    console.error("Failed to fetch risk analysis:", error);
    return null;
  }
};
// 9. CRITICAL ALERTS (For Performance Page)
export const getCriticalAlerts = async () => {
  if (!USE_REAL_API) {
    // Return empty array or mock data for testing
    // return [];
    return [
       { assetId: 1, assetName: "Adani Ent", category: "STOCK", message: "Sharp decline detected.", changePercent: -12.4, type: "WARNING" },
       { assetId: 2, assetName: "Nifty Bees", category: "ETF", message: "Strong rally observed.", changePercent: 5.8, type: "OPPORTUNITY" }
    ];
  }

  try {
    const response = await api.get('/alerts/critical');
    // Ensure we always return an array
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Failed to fetch critical alerts:", error);
    return [];
  }
};// 10. REBALANCE SUGGESTIONS (New)
  export const getRebalanceSuggestions = async () => {
    if (!USE_REAL_API) {
      return `* **Increase MF_SMALL:** Elevating small-cap fund allocation introduces higher growth potential.
  * **Increase MF_MID:** Boosting mid-cap fund exposure taps into companies with strong growth trajectories.
  * **Decrease MF_LARGE:** Reducing large-cap fund weight prevents overconcentration.
  * **Decrease STOCK:** Trimming individual stock holdings mitigates specific company risk.
  * **Increase GOLD_ETF (gradually):** Incrementally building gold ETF exposure enhances portfolio resilience.`;
    }

    try {
      const response = await api.get('/ai/rebalance');
      // The backend returns a raw String, so we just return it directly
      return response.data || "";
    } catch (error) {
      console.error("Failed to fetch rebalance suggestions:", error);
      return "";
    }
  };
  // 11. ASSET SIGNAL (Individual Stock Insight)
  export const getAssetSignal = async (assetId) => {
    if (!USE_REAL_API) {
      return "Mock Insight: This stock has shown strong resilience at the ₹150 support level. Momentum indicators suggest a potential breakout if volume increases.";
    }

    try {
      const response = await api.get(`/ai/asset-signal/${assetId}`);
      // Assuming backend returns a raw string or an object with a 'message' field
      return typeof response.data === 'string' ? response.data : response.data.message || JSON.stringify(response.data);
    } catch (error) {
      console.error(`Failed to fetch signal for asset ${assetId}`, error);
      return "Unable to generate AI signal at this time.";
    }
  };