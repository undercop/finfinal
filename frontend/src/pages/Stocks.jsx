import React, { useState, useEffect, useRef } from 'react';
import { getStocks, getIntradayPrices, getAssetSignal } from '../services/api';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp, TrendingDown, Layers, Activity, Clock, Sparkles, Loader2, FileText } from 'lucide-react';

const Stocks = () => {
  // Main Data
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);

  // Graph State
  const [viewMode, setViewMode] = useState('HISTORY'); // Options: 'HISTORY' | 'LIVE'
  const [liveData, setLiveData] = useState([]);

  // AI Signal State
  const [aiSignal, setAiSignal] = useState(null);
  const [loadingSignal, setLoadingSignal] = useState(false);

  const [loading, setLoading] = useState(true);

  // 1. Load Initial Stock List
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getStocks();
        setStocks(data);
        if (data.length > 0) {
          setSelectedStock(data[0]);
        }
      } catch (error) {
        console.error("Failed to load stocks:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // 2. Handle Graph Data Switching & Polling
  useEffect(() => {
    if (!selectedStock) return;

    // Reset AI Signal when stock changes
    setAiSignal(null);

    // A. If History Mode: Do nothing (data is already in selectedStock.history)
    if (viewMode === 'HISTORY') {
      return;
    }

    // B. If Live Mode: Fetch immediately + Set Interval
    const fetchLive = async () => {
      const data = await getIntradayPrices(selectedStock.id);
      setLiveData(data);
    };

    fetchLive(); // Fetch once immediately
    const interval = setInterval(fetchLive, 5000); // Fetch every 5 seconds

    return () => clearInterval(interval); // Cleanup on switch/unmount

  }, [viewMode, selectedStock]);

  // 3. Handle AI Signal Generation
  const handleGenerateSignal = async () => {
    if (!selectedStock) return;

    setLoadingSignal(true);
    const signal = await getAssetSignal(selectedStock.id);
    setAiSignal(signal);
    setLoadingSignal(false);
  };


  // Helper: Decide which data to show
  const currentChartData = viewMode === 'HISTORY'
    ? (selectedStock?.history || [])
    : liveData;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-blue-500 animate-pulse font-medium">Loading Market Data...</div>
      </div>
    );
  }

  if (!selectedStock) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        No stocks found in portfolio.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">My Stocks</h1>
          <p className="text-slate-400 mt-1">Manage your holdings and analyze performance.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT COLUMN: Main Chart Section */}
          <div className="lg:col-span-2 space-y-6">

            {/* 1. Chart Container */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-xl">

              <div className="flex justify-between items-end mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    {selectedStock.name}
                    <span className="text-sm font-normal text-slate-500 bg-slate-800 px-2 py-1 rounded">
                      {selectedStock.symbol}
                    </span>
                  </h2>
                  <div className="flex items-center gap-2 mt-2">
                    {/* TOGGLE BUTTONS */}
                    <button
                      onClick={() => setViewMode('HISTORY')}
                      className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-all ${
                        viewMode === 'HISTORY'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      <Clock size={12} /> 1 Year History
                    </button>
                    <button
                      onClick={() => setViewMode('LIVE')}
                      className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-all ${
                        viewMode === 'LIVE'
                        ? 'bg-red-600 text-white animate-pulse-slow'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      <Activity size={12} /> Live Intraday
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  {/* PRICE DISPLAY */}
                  <p className="text-3xl font-bold text-white">
                    ₹{Number(selectedStock.price).toFixed(2)}
                  </p>
                  <p className={`text-sm font-medium flex items-center justify-end ${selectedStock.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {selectedStock.isPositive ? <TrendingUp size={16} className="mr-1"/> : <TrendingDown size={16} className="mr-1"/>}
                    {selectedStock.change}
                  </p>
                </div>
              </div>

              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={currentChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />

                    <XAxis
                      dataKey="day"
                      // Remove hide logic to always show time/date
                      stroke="#64748b"
                      tick={{fill: '#64748b', fontSize: 11}}
                      axisLine={false}
                      minTickGap={30}
                    />

                    <YAxis
                      stroke="#64748b"
                      tick={{fill: '#64748b', fontSize: 12}}
                      axisLine={false}
                      domain={['auto', 'auto']}
                      tickFormatter={(value) => `₹${value}`}
                    />

                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                      formatter={(value) => [`₹${Number(value).toFixed(2)}`, "Price"]}
                      labelStyle={viewMode === 'LIVE' ? { display: 'none' } : {}}
                      labelFormatter={(label) => viewMode === 'HISTORY' ? `Date: ${label}` : ''}
                    />

                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke={viewMode === 'LIVE' ? '#3b82f6' : (selectedStock.isPositive ? "#10b981" : "#ef4444")}
                      strokeWidth={3}
                      dot={false}
                      activeDot={{ r: 6, fill: '#fff' }}
                      isAnimationActive={true}
                      animationDuration={500}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 2. AI Insight Section */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-xl p-6 transition-all">
              <div className="flex justify-between items-center mb-4">
                 <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Sparkles size={18} className="text-blue-500"/>
                    AI Asset Insight
                 </h3>
                 {!aiSignal && (
                   <button
                     onClick={handleGenerateSignal}
                     disabled={loadingSignal}
                     className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold flex items-center gap-2 transition-all disabled:opacity-50"
                   >
                     {loadingSignal ? <Loader2 size={16} className="animate-spin"/> : <Sparkles size={16}/>}
                     {loadingSignal ? "Analyzing..." : "Generate Insight"}
                   </button>
                 )}
              </div>

              {/* SIGNAL DISPLAY AREA */}
              {loadingSignal && (
                <div className="h-24 flex items-center justify-center text-slate-500 animate-pulse text-sm">
                   Analyzing market trends for {selectedStock.name}...
                </div>
              )}

              {aiSignal && !loadingSignal && (
                <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800/50 animate-in fade-in slide-in-from-top-2">
                   <div className="flex gap-3">
                      <div className="mt-1 min-w-[20px]">
                        <FileText size={20} className="text-blue-400"/>
                      </div>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {aiSignal}
                      </p>
                   </div>
                   <div className="mt-3 pt-3 border-t border-slate-800/50 text-right">
                      <button
                        onClick={() => setAiSignal(null)}
                        className="text-xs text-slate-500 hover:text-white transition"
                      >
                        Close Insight
                      </button>
                   </div>
                </div>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN: Stock List Selector */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-xl overflow-hidden flex flex-col h-[600px]">
            <div className="p-4 border-b border-slate-800 bg-slate-800/50">
              <h3 className="font-bold text-slate-200 flex items-center">
                <Layers size={18} className="mr-2 text-blue-500"/>
                Your Portfolio
              </h3>
            </div>

            <div className="divide-y divide-slate-800 overflow-y-auto custom-scrollbar">
              {stocks.map((stock) => (
                <button
                  key={stock.id}
                  onClick={() => {
                    setSelectedStock(stock);
                    setLiveData([]); // Clear old live data when switching stock
                  }}
                  className={`w-full p-4 flex justify-between items-center hover:bg-slate-800 transition text-left group ${
                    selectedStock.id === stock.id ? 'bg-slate-800 border-l-4 border-blue-500' : 'border-l-4 border-transparent'
                  }`}
                >
                  <div className="flex-1 pr-2">
                    <p className="font-bold text-white group-hover:text-blue-400 transition truncate">
                        {stock.name}
                    </p>
                    <p className="text-xs text-slate-500">{stock.shares} Quantity</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-200">
                      ₹{Number(stock.price).toFixed(2)}
                    </p>
                    <p className={`text-xs ${stock.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                      {stock.change}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Stocks;