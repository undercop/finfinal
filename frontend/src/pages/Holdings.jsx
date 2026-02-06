import React, { useEffect, useState, useRef } from 'react';
import { getHoldings, placeTrade, getStocks, getBatchLivePrices } from '../services/api'; // Import the new batch function
import { Briefcase, TrendingUp, TrendingDown, RefreshCw, Zap } from 'lucide-react';

const Holdings = () => {
  // --- STATE ---
  const [holdings, setHoldings] = useState([]);
  const [availableStocks, setAvailableStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dynamic Data (Live updates)
  const [livePrices, setLivePrices] = useState({}); // Mapping: { id: price }

  // Terminal State
  const [selectedAssetId, setSelectedAssetId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [tradeType, setTradeType] = useState('BUY');
  const [processing, setProcessing] = useState(false);

  // --- 1. INITIAL LOAD (Static Data) ---
  const loadStaticData = async () => {
    setLoading(true);
    try {
      const [holdingsData, stocksData] = await Promise.all([
        getHoldings(),
        getStocks()
      ]);

      setHoldings(holdingsData);
      setAvailableStocks(stocksData);

      // Default selection
      if (stocksData.length > 0) setSelectedAssetId(stocksData[0].id);

    } catch (error) {
      console.error("Failed to load initial data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStaticData();
  }, []);

  // --- 2. LIVE PRICE POLLING (Runs every 3s) ---
  // This effect depends on 'availableStocks' so it knows WHAT to fetch
  useEffect(() => {
    if (availableStocks.length === 0) return;

    const fetchAllPrices = async () => {
      // 1. Gather all IDs we need prices for
      // (We use availableStocks because it likely contains everything, including holdings)
      const allIds = availableStocks.map(s => s.id);

      // 2. Fetch them all in parallel using our new API helper
      const results = await getBatchLivePrices(allIds);

      // 3. Update state
      const newPriceMap = {};
      results.forEach(item => {
        newPriceMap[item.assetId] = item.price;
      });

      // Merge with previous prices to avoid flickering if one request fails
      setLivePrices(prev => ({ ...prev, ...newPriceMap }));
    };

    // Run immediately once, then set interval
    fetchAllPrices();
    const intervalId = setInterval(fetchAllPrices, 3000);

    return () => clearInterval(intervalId);
  }, [availableStocks]); // Rerun this setup if the stock list changes


  // --- CALCULATIONS ---
  const getPrice = (id, fallback = 0) => {
    return livePrices[id] !== undefined ? livePrices[id] : fallback;
  };

  // Calculate Totals using LIVE prices
  const totalInvestment = holdings.reduce((acc, curr) => acc + (curr.avgPrice * curr.quantity), 0);
  const currentValue = holdings.reduce((acc, curr) => {
    const price = getPrice(curr.id, curr.currentPrice);
    return acc + (price * curr.quantity);
  }, 0);
  const totalPL = currentValue - totalInvestment;

  // Terminal Calculations
  const selectedStockStatic = availableStocks.find(s => String(s.id) === String(selectedAssetId)) || {};
  const currentLivePrice = getPrice(selectedAssetId, selectedStockStatic.price);
  const estimatedTotal = currentLivePrice * quantity;

  const currentHolding = holdings.find(h => String(h.id) === String(selectedAssetId));
  const ownedQuantity = currentHolding ? currentHolding.quantity : 0;


  // --- RENDER ---
  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-blue-500">Loading Holdings...</div>;

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-lg">
              <p className="text-slate-400 text-sm font-medium">Total Investment</p>
              <h3 className="text-2xl font-bold text-white mt-1">₹{totalInvestment.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h3>
           </div>
           <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-lg">
              <p className="text-slate-400 text-sm font-medium">Current Value</p>
              <h3 className="text-2xl font-bold text-blue-400 mt-1 animate-pulse-short">
                ₹{currentValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </h3>
           </div>
           <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-lg">
              <p className="text-slate-400 text-sm font-medium">Total Profit/Loss</p>
              <h3 className={`text-2xl font-bold mt-1 ${totalPL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {totalPL >= 0 ? '+' : ''}₹{totalPL.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </h3>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT: HOLDINGS TABLE */}
          <div className="lg:col-span-2 bg-slate-900 rounded-xl border border-slate-800 shadow-lg overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Briefcase size={20} className="text-blue-500"/> Your Assets
              </h3>
              <button onClick={loadStaticData} className="p-2 hover:bg-slate-700 rounded-full text-slate-400 transition">
                <RefreshCw size={18} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-800 text-xs uppercase text-slate-400 font-semibold tracking-wide">
                  <tr>
                    <th className="p-4">Asset</th>
                    <th className="p-4 text-center">Qty</th>
                    <th className="p-4 text-right">Avg Price</th>
                    <th className="p-4 text-right">Current</th>
                    <th className="p-4 text-right">P/L</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-sm">
                  {holdings.map((item) => {
                    const livePrice = getPrice(item.id, item.currentPrice);
                    const pl = (livePrice - item.avgPrice) * item.quantity;
                    const isProfit = pl >= 0;

                    return (
                      <tr key={item.id} className="hover:bg-slate-800/50 transition duration-150">
                        <td className="p-4 font-bold text-white">
                          {item.name}
                          <span className="block text-xs font-normal text-slate-500">{item.symbol}</span>
                        </td>
                        <td className="p-4 text-center text-slate-300">{item.quantity}</td>
                        <td className="p-4 text-right text-slate-400">₹{item.avgPrice.toFixed(2)}</td>

                        {/* Live Price Cell (Reactive) */}
                        <td className="p-4 text-right text-blue-400 font-medium">
                           ₹{livePrice.toFixed(2)}
                        </td>

                        <td className={`p-4 text-right font-bold ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
                          <div className="flex items-center justify-end gap-1">
                            {isProfit ? <TrendingUp size={14}/> : <TrendingDown size={14}/>}
                            ₹{Math.abs(pl).toFixed(2)}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {holdings.length === 0 && (
                     <tr><td colSpan="5" className="p-8 text-center text-slate-500">No holdings found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* RIGHT: EXECUTION TERMINAL */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 h-fit sticky top-24 shadow-lg ring-1 ring-white/5">
            <h3 className="font-bold text-white mb-6 flex items-center gap-2 text-lg">
              <Zap className="text-yellow-500" fill="currentColor" size={20}/>
              Execution Terminal
            </h3>

            {/* Instrument Selector */}
            <div className="mb-5">
              <label className="text-xs text-slate-400 font-bold mb-2 block uppercase tracking-wider">Select Instrument</label>
              <select
                value={selectedAssetId}
                onChange={(e) => setSelectedAssetId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                {availableStocks.map(stock => (
                  <option key={stock.id} value={stock.id}>
                    {stock.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Quantity</label>
                <span className="text-xs text-blue-400">You Own: {ownedQuantity}</span>
              </div>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder-slate-600"
              />
            </div>

            {/* Price Details (Reactive) */}
            <div className="space-y-3 mb-8 text-sm bg-slate-950/50 p-4 rounded-lg border border-slate-800/50">
              <div className="flex justify-between text-slate-400">
                <span>Market Price:</span>
                <span className="text-white font-medium">₹{currentLivePrice}</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-2 mt-2">
                <span className="text-slate-400">Est. Total:</span>
                <span className={`font-bold text-lg ${tradeType === 'BUY' ? 'text-green-400' : 'text-red-400'}`}>
                   ₹{estimatedTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button onClick={() => setTradeType('BUY')} className={`py-3 rounded-lg font-bold text-sm border ${tradeType === 'BUY' ? 'bg-green-600 border-green-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>BUY</button>
              <button onClick={() => setTradeType('SELL')} className={`py-3 rounded-lg font-bold text-sm border ${tradeType === 'SELL' ? 'bg-red-600 border-red-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>SELL</button>
            </div>

            <button
              onClick={async () => {
                if (!selectedAssetId) return;
                setProcessing(true);
                try {
                  await placeTrade({
                    assetId: selectedAssetId,
                    type: tradeType,
                    quantity: parseInt(quantity),
                    price: currentLivePrice
                  });
                  alert("Order Placed!");
                  loadStaticData(); // Refresh holdings list to update quantity
                } catch(e) { alert("Failed"); }
                finally { setProcessing(false); }
              }}
              disabled={processing || !selectedAssetId}
              className={`w-full py-4 rounded-lg font-bold text-base text-white shadow-lg ${processing ? 'bg-slate-700' : tradeType === 'BUY' ? 'bg-green-600' : 'bg-red-600'}`}
            >
              {processing ? 'Executing...' : `Confirm ${tradeType} Order`}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Holdings;