import React, { useEffect, useState } from 'react';
import { getDashboardData, getTransactions } from '../services/api';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, Sector } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, ArrowRight, ArrowUpRight, ArrowDownLeft, Wallet } from 'lucide-react';

// --- CONFIGURATION ---
const COLORS = [
  '#3b82f6', // Blue (Stocks)
  '#8b5cf6', // Violet (MF Mid)
  '#10b981', // Emerald (MF Small)
  '#f59e0b', // Amber (Gold)
  '#ec4899', // Pink (Others)
  '#6366f1', // Indigo (MF Large)
];

const categoryNameMap = {
  "STOCK": "Equities",
  "MF_LARGE": "Large Cap Funds",
  "MF_MID": "Mid Cap Funds",
  "MF_SMALL": "Small Cap Funds",
  "GOLD_ETF": "Gold ETF",
  "SILVER_ETF": "Silver ETF"
};

const formatCurrency = (val) => `₹${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

// --- COMPONENTS ---

const StatCard = ({ title, value, subValue, isPositive, icon: Icon }) => (
  <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg hover:border-slate-600 transition group relative overflow-hidden">
    <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
       <Icon size={80} />
    </div>
    <div className="flex justify-between items-start relative z-10">
      <div>
        <p className="text-slate-400 text-sm font-medium mb-1 uppercase tracking-wider">{title}</p>
        <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${isPositive ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'}`}>
        <Icon size={22} />
      </div>
    </div>
    {subValue && (
      <div className={`mt-4 flex items-center text-sm font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
        {isPositive ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
        <span>{subValue}</span>
        <span className="text-slate-500 ml-2 font-normal">vs yesterday</span>
      </div>
    )}
  </div>
);

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl">
        <p className="text-white font-bold text-sm mb-1">{data.name}</p>
        <div className="flex items-center gap-4 text-xs">
          <span className="text-slate-400">Value:</span>
          <span className="text-blue-400 font-mono">{formatCurrency(data.value)}</span>
        </div>
        {data.percent && (
            <div className="flex items-center gap-4 text-xs mt-1">
              <span className="text-slate-400">Share:</span>
              <span className="text-green-400 font-mono">{(data.percent * 100).toFixed(1)}%</span>
            </div>
        )}
      </div>
    );
  }
  return null;
};

// --- MAIN DASHBOARD ---
const Dashboard = ({ onNavigate }) => {
  const [data, setData] = useState(null);
  const [recentTx, setRecentTx] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [dashboardResult, txResult] = await Promise.all([
            getDashboardData(),
            getTransactions()
        ]);
        setData(dashboardResult);
        setRecentTx(txResult.slice(0, 3));
      } catch (e) {
        console.error("Dashboard Load Error", e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-blue-500 animate-pulse font-bold">Loading Dashboard...</div>;
  if (!data) return <div className="text-white text-center mt-10">Failed to load data</div>;

  const { summary, diversification, user } = data;

  // Process chart data for better display
  const chartData = (diversification || []).map((item, index) => ({
    ...item,
    name: categoryNameMap[item.name] || item.name.replace(/_/g, ' '), // Format Name
    color: COLORS[index % COLORS.length] // Assign Pretty Colors
  }));

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex justify-between items-end">
           <div>
             <h1 className="text-3xl font-bold text-white">Dashboard</h1>
             <p className="text-slate-400 mt-1">Welcome back, <span className="text-blue-400">{user?.name || "User"}</span>.</p>
           </div>
           <div className="text-right hidden sm:block">
             <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Total Net Worth</p>
             <p className="text-2xl font-bold text-white tracking-tight">{formatCurrency(summary?.totalPortfolioValue || 0)}</p>
           </div>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Portfolio Value"
            value={formatCurrency(summary?.totalPortfolioValue || 0)}
            subValue={`+${summary?.oneDayReturn || 0}%`}
            isPositive={summary?.oneDayReturn > 0}
            icon={Wallet}
          />
          <StatCard
            title="One Day P&L"
            value={formatCurrency(summary?.oneDayReturnValue || 0)}
            subValue="Today's Gain"
            isPositive={summary?.oneDayReturnValue > 0}
            icon={TrendingUp}
          />
          <StatCard
            title="Projected (30 Days)"
            value={formatCurrency(summary?.projectedValue || 0)}
            subValue="AI Estimate"
            isPositive={true}
            icon={DollarSign}
          />
        </div>

        {/* CHARTS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ASSET DIVERSIFICATION (Beautiful Donut) */}
          <div className="lg:col-span-2 bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg relative">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
              Asset Allocation
            </h3>

            <div className="flex flex-col md:flex-row items-center justify-around h-72">
              {/* Chart */}
              <div className="h-full w-full md:w-1/2 relative">
                 <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                   <p className="text-slate-400 text-xs font-medium uppercase">Total Assets</p>
                   <p className="text-white font-bold text-lg">{chartData.length}</p>
                </div>
              </div>

              {/* Custom Legend (Right Side) */}
              <div className="w-full md:w-1/2 grid grid-cols-1 gap-3 pl-4">
                 {chartData.map((item, idx) => (
                   <div key={idx} className="flex items-center justify-between group cursor-default">
                      <div className="flex items-center gap-3">
                         <div className="w-3 h-3 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]" style={{ backgroundColor: item.color }}></div>
                         <span className="text-slate-300 text-sm font-medium group-hover:text-white transition">{item.name}</span>
                      </div>
                      <span className="text-slate-400 text-xs font-mono">{formatCurrency(item.value)}</span>
                   </div>
                 ))}
              </div>
            </div>
          </div>

          {/* MARKET ACTION CARD */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl border border-slate-700 shadow-lg flex flex-col justify-center items-center text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>

            <div className="p-5 bg-slate-800 rounded-full mb-6 border border-slate-700 shadow-inner">
              <TrendingUp size={36} className="text-blue-500" />
            </div>

            <h3 className="text-xl font-bold text-white mb-2">Market Action</h3>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed max-w-[200px]">
              Review live market trends and manage your portfolio positions.
            </p>

            <button
              onClick={() => onNavigate('stocks')}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition font-bold shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
            >
              Go to Stocks <ArrowRight size={18}/>
            </button>
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-lg overflow-hidden">
            <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                   <span className="w-1 h-6 bg-green-500 rounded-full"></span>
                   Recent Activity
                </h3>
                <button
                  onClick={() => onNavigate('transactions')}
                  className="text-blue-400 text-sm hover:text-blue-300 flex items-center gap-1 transition font-medium"
                >
                    View All <ArrowRight size={16}/>
                </button>
            </div>
            <div className="divide-y divide-slate-700/50">
                {recentTx.length > 0 ? recentTx.map((tx) => (
                    <div key={tx.id} className="p-5 flex items-center justify-between hover:bg-slate-700/30 transition group">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${tx.type === 'BUY' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                {tx.type === 'BUY' ? <ArrowDownLeft size={20}/> : <ArrowUpRight size={20}/>}
                            </div>
                            <div>
                                <p className="text-white font-bold text-sm group-hover:text-blue-400 transition">{tx.asset}</p>
                                <p className="text-xs text-slate-500 mt-0.5">{tx.date}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-white font-bold font-mono">{tx.total}</p>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${tx.type === 'BUY' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                {tx.type}
                            </span>
                        </div>
                    </div>
                )) : (
                    <div className="p-8 text-center text-slate-500 text-sm">No recent transactions found.</div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;