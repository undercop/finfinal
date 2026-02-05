import React, { useState, useEffect } from 'react';
import { getStocks } from '../services/api'; // Ensure your API service is updated to fetch from holdings
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp, TrendingDown, Layers } from 'lucide-react';

const Stocks = () => {
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [loading, setLoading] = useState(true);

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
                  <p className="text-slate-400 text-sm">
                    Performance ({selectedStock.history?.length || 0} Days)
                  </p>
                </div>
                <div className="text-right">
                  {/* RUPEE SIGN FIXED */}
                  <p className="text-3xl font-bold text-white">₹{selectedStock.price}</p>
                  <p className={`text-sm font-medium flex items-center justify-end ${selectedStock.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {selectedStock.isPositive ? <TrendingUp size={16} className="mr-1"/> : <TrendingDown size={16} className="mr-1"/>}
                    {selectedStock.change}
                  </p>
                </div>
              </div>

              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={selectedStock.history || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis
                      dataKey="day"
                      stroke="#64748b"
                      tick={{fill: '#64748b'}}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#64748b"
                      tick={{fill: '#64748b'}}
                      axisLine={false}
                      domain={['auto', 'auto']}
                      tickFormatter={(value) => `₹${value}`} // RUPEE SIGN FIXED
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                      formatter={(value) => [`₹${value}`, "Price"]} // RUPEE SIGN FIXED
                    />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke={selectedStock.isPositive ? "#10b981" : "#ef4444"}
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Stock List Selector (UPDATED) */}
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
                  onClick={() => setSelectedStock(stock)}
                  className={`w-full p-4 flex justify-between items-center hover:bg-slate-800 transition text-left group ${
                    selectedStock.id === stock.id ? 'bg-slate-800 border-l-4 border-blue-500' : 'border-l-4 border-transparent'
                  }`}
                >
                  <div className="flex-1 pr-2">
                    {/* SHOW FULL NAME instead of just symbol */}
                    <p className="font-bold text-white group-hover:text-blue-400 transition truncate">
                        {stock.name}
                    </p>
                    {/* FETCH FROM HOLDINGS: Using stock.quantity */}
                    <p className="text-xs text-slate-500">{stock.quantity} Quantity</p>
                  </div>
                  <div className="text-right">
                    {/* RUPEE SIGN FIXED */}
                    <p className="text-sm font-medium text-slate-200">₹{stock.price}</p>
                    <p className={`text-xs ${stock.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                      {stock.change}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Note: "Load More" button has been removed as per your request */}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Stocks;