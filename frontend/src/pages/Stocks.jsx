import React, { useState } from 'react';
import { mockStockData } from '../data/mock';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp, TrendingDown, Layers } from 'lucide-react';

const Stocks = () => {
  // State to track which stock is currently selected for the chart
  const [selectedStock, setSelectedStock] = useState(mockStockData[0]);

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">My Stocks</h1>
          <p className="text-slate-400 mt-1">Manage your holdings and analyze performance.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT COLUMN: Main Chart Section (Takes up 2 columns space) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-xl">

              {/* Chart Header */}
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    {selectedStock.name}
                    <span className="text-sm font-normal text-slate-500 bg-slate-800 px-2 py-1 rounded">
                      {selectedStock.symbol}
                    </span>
                  </h2>
                  <p className="text-slate-400 text-sm">Weekly Performance</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-white">${selectedStock.price}</p>
                  <p className={`text-sm font-medium flex items-center justify-end ${selectedStock.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {selectedStock.isPositive ? <TrendingUp size={16} className="mr-1"/> : <TrendingDown size={16} className="mr-1"/>}
                    {selectedStock.change}
                  </p>
                </div>
              </div>

              {/* The Line Chart */}
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={selectedStock.history}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
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
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke={selectedStock.isPositive ? "#10b981" : "#ef4444"}
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#1e293b', strokeWidth: 2 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Stock List Selector */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-xl overflow-hidden flex flex-col h-fit">
            <div className="p-4 border-b border-slate-800 bg-slate-800/50">
              <h3 className="font-bold text-slate-200 flex items-center">
                <Layers size={18} className="mr-2 text-blue-500"/>
                Your Portfolio
              </h3>
            </div>

            <div className="divide-y divide-slate-800">
              {mockStockData.map((stock) => (
                <button
                  key={stock.symbol}
                  onClick={() => setSelectedStock(stock)}
                  className={`w-full p-4 flex justify-between items-center hover:bg-slate-800 transition text-left group ${
                    selectedStock.symbol === stock.symbol ? 'bg-slate-800 border-l-4 border-blue-500' : 'border-l-4 border-transparent'
                  }`}
                >
                  <div>
                    <p className="font-bold text-white group-hover:text-blue-400 transition">{stock.symbol}</p>
                    <p className="text-xs text-slate-500">{stock.shares} Shares</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-200">${stock.price}</p>
                    <p className={`text-xs ${stock.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                      {stock.change}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            <div className="p-4 bg-slate-800/30 text-center">
              <button className="text-xs text-blue-400 hover:text-blue-300 font-medium">
                + Add New Stock
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Stocks;