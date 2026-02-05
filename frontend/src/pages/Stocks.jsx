import React, { useState, useEffect, useRef } from 'react';
import { getStocks, getIntradayPrices } from '../services/api'; // Import new function
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp, TrendingDown, Layers, Activity, Clock } from 'lucide-react';

const Stocks = () => {
  // Main Data
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);

  // Graph State
  const [viewMode, setViewMode] = useState('HISTORY'); // Options: 'HISTORY' | 'LIVE'
  const [liveData, setLiveData] = useState([]);

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

  }, [viewMode, selectedStock]); // Re-run if stock or mode changes


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
                  <p className="text-3xl font-bold text-white">₹{selectedStock.price}</p>
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
                      stroke="#64748b"
                      tick={{fill: '#64748b', fontSize: 11}} // Smaller font for time
                      axisLine={false}
                      minTickGap={30} // Prevents time labels from overlapping
                    />

                    <YAxis
                      stroke="#64748b"
                      tick={{fill: '#64748b', fontSize: 12}}
                      axisLine={false}
                      domain={['auto', 'auto']} // Keeps the line centered
                      tickFormatter={(value) => `₹${value}`}
                    />

                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                      formatter={(value) => [`₹${Number(value).toFixed(2)}`, "Price"]}
                      labelFormatter={(label) => `${viewMode === 'LIVE' ? 'Time' : 'Date'}: ${label}`}
                    />

                    <Line
                      type="monotone" // <--- MAKES THE LINE SMOOTH / CURVED
                      dataKey="price"
                      // Blue for Live, Green/Red for History
                      stroke={viewMode === 'LIVE' ? '#3b82f6' : (selectedStock.isPositive ? "#10b981" : "#ef4444")}
                      strokeWidth={3} // Slightly thicker for better visibility
                      dot={false}     // <--- REMOVES DOTS for a clean "stream" look
                      activeDot={{ r: 6, fill: '#fff' }}
                      isAnimationActive={true} // Keep animation for smooth updates
                      animationDuration={500}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
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
                    // Optional: Reset to History mode when changing stock?
                    // Or keep 'LIVE' mode if user prefers it. Currently keeping mode.
                    setLiveData([]); // Clear old live data
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
                    <p className="text-sm font-medium text-slate-200">₹{stock.price}</p>
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