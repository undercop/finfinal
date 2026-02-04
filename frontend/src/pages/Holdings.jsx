import React, { useEffect, useState } from 'react';
import { getHoldings, placeTrade, getStocks } from '../services/api';
import { Briefcase, TrendingUp, TrendingDown, RefreshCw, Zap } from 'lucide-react';

const Holdings = () => {
  // Data State
  const [holdings, setHoldings] = useState([]);
  const [availableStocks, setAvailableStocks] = useState([]); // For the dropdown
  const [loading, setLoading] = useState(true);

  // Terminal State
  const [selectedAssetId, setSelectedAssetId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [tradeType, setTradeType] = useState('BUY');
  const [processing, setProcessing] = useState(false);

  // Initial Load
  const loadData = async () => {
    setLoading(true);
    const [holdingsData, stocksData] = await Promise.all([
      getHoldings(),
      getStocks()
    ]);

    setHoldings(holdingsData);
    setAvailableStocks(stocksData);

    // Set default selected asset for dropdown
    if (stocksData.length > 0) {
        setSelectedAssetId(stocksData[0].id);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // --- Calculations ---
  // 1. Calculate Portfolio Summary
  const totalInvestment = holdings.reduce((acc, curr) => acc + (curr.avgPrice * curr.quantity), 0);
  const currentValue = holdings.reduce((acc, curr) => acc + (curr.currentPrice * curr.quantity), 0);
  const totalPL = currentValue - totalInvestment;

  // 2. Terminal Logic (Get selected stock details)
  const selectedStock = availableStocks.find(s => String(s.id) === String(selectedAssetId)) || {};
  const estimatedPrice = selectedStock.price || 0;
  const estimatedTotal = estimatedPrice * quantity;

  // --- Handlers ---
  const handleTrade = async () => {
    if (!selectedAssetId) return;
    setProcessing(true);

    try {
      await placeTrade({
        assetId: selectedAssetId,
        type: tradeType,
        quantity: parseInt(quantity),
        price: estimatedPrice
      });

      alert(`${tradeType} order successfully placed!`);
      loadData(); // Refresh table to show new quantity
    } catch (error) {
      alert("Trade failed. Please check backend connection.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-blue-500">Loading Holdings...</div>;

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* 1. TOP SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-lg">
              <p className="text-slate-400 text-sm font-medium">Total Investment</p>
              <h3 className="text-2xl font-bold text-white mt-1">${totalInvestment.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h3>
           </div>
           <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-lg">
              <p className="text-slate-400 text-sm font-medium">Current Value</p>
              <h3 className="text-2xl font-bold text-blue-400 mt-1">${currentValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h3>
           </div>
           <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-lg">
              <p className="text-slate-400 text-sm font-medium">Total Profit/Loss</p>
              <h3 className={`text-2xl font-bold mt-1 ${totalPL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {totalPL >= 0 ? '+' : ''}${totalPL.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </h3>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* 2. HOLDINGS TABLE (Left Side - 2 Cols) */}
          <div className="lg:col-span-2 bg-slate-900 rounded-xl border border-slate-800 shadow-lg overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Briefcase size={20} className="text-blue-500"/> Your Assets
              </h3>
              <button onClick={loadData} className="p-2 hover:bg-slate-700 rounded-full text-slate-400 transition">
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
                    const pl = (item.currentPrice - item.avgPrice) * item.quantity;
                    const isProfit = pl >= 0;
                    return (
                      <tr key={item.id || item.symbol} className="hover:bg-slate-800/50 transition duration-150">
                        <td className="p-4 font-bold text-white">
                          {item.symbol}
                          <span className="block text-xs font-normal text-slate-500">{item.name}</span>
                        </td>
                        <td className="p-4 text-center text-slate-300">{item.quantity}</td>
                        <td className="p-4 text-right text-slate-400">${item.avgPrice.toFixed(2)}</td>
                        <td className="p-4 text-right text-blue-400 font-medium">${item.currentPrice.toFixed(2)}</td>
                        <td className={`p-4 text-right font-bold ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
                          <div className="flex items-center justify-end gap-1">
                            {isProfit ? <TrendingUp size={14}/> : <TrendingDown size={14}/>}
                            ${Math.abs(pl).toFixed(2)}
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

          {/* 3. EXECUTION TERMINAL (Right Side - 1 Col) */}
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
                    {stock.symbol} — ${stock.price}
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity Input */}
            <div className="mb-6">
              <label className="text-xs text-slate-400 font-bold mb-2 block uppercase tracking-wider">Quantity</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder-slate-600"
              />
            </div>

            {/* Price Details */}
            <div className="space-y-3 mb-8 text-sm bg-slate-950/50 p-4 rounded-lg border border-slate-800/50">
              <div className="flex justify-between text-slate-400">
                <span>Market Price:</span>
                <span className="text-white font-medium">${estimatedPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-2 mt-2">
                <span className="text-slate-400">Est. Total:</span>
                <span className={`font-bold text-lg ${tradeType === 'BUY' ? 'text-green-400' : 'text-red-400'}`}>
                   ${estimatedTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Buy/Sell Toggles */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                onClick={() => setTradeType('BUY')}
                className={`py-3 rounded-lg font-bold text-sm transition-all duration-200 border ${
                  tradeType === 'BUY'
                  ? 'bg-green-600 border-green-500 text-white shadow-[0_0_15px_rgba(22,163,74,0.3)]'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                }`}
              >
                BUY
              </button>
              <button
                onClick={() => setTradeType('SELL')}
                className={`py-3 rounded-lg font-bold text-sm transition-all duration-200 border ${
                  tradeType === 'SELL'
                  ? 'bg-red-600 border-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.3)]'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                }`}
              >
                SELL
              </button>
            </div>

            {/* Confirm Button */}
            <button
              onClick={handleTrade}
              disabled={processing || !selectedAssetId}
              className={`w-full py-4 rounded-lg font-bold text-base text-white shadow-lg transition-all transform active:scale-[0.98] ${
                processing ? 'bg-slate-700 cursor-not-allowed' :
                tradeType === 'BUY'
                  ? 'bg-green-600 hover:bg-green-500'
                  : 'bg-red-600 hover:bg-red-500'
              }`}
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