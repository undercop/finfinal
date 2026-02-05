import React, { useEffect, useState } from 'react';
import { getDashboardData, getTransactions } from '../services/api';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, ArrowRight, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

// Reusable Stat Card
const StatCard = ({ title, value, subValue, isPositive, icon: Icon }) => (
  <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg hover:border-slate-600 transition">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-white">{value}</h3>
      </div>
      <div className={`p-2 rounded-lg ${isPositive ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'}`}>
        <Icon size={20} />
      </div>
    </div>
    {subValue && (
      <div className={`mt-4 flex items-center text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
        {isPositive ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
        <span className="font-medium">{subValue}</span>
        <span className="text-slate-500 ml-2">vs yesterday</span>
      </div>
    )}
  </div>
);

const Dashboard = ({ onNavigate }) => { // <--- This prop is required for buttons to work!
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

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-blue-500">Loading Dashboard...</div>;
  if (!data) return <div className="text-white text-center mt-10">Failed to load data</div>;

  const { summary, diversification, user } = data;

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* --- HEADER (Cleaned Up) --- */}
        <div>
           <h1 className="text-3xl font-bold text-white">Dashboard</h1>
           <p className="text-slate-400 mt-1">Welcome back, {user?.name || "User"}.</p>
        </div>

        {/* --- MIDDLE SECTION: Stats Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Portfolio Value"
            value={`₹${(summary?.totalPortfolioValue || 0).toLocaleString()}`}
            subValue={`+${summary?.oneDayReturn || 0}%`}
            isPositive={summary?.oneDayReturn > 0}
            icon={DollarSign}
          />
          <StatCard
            title="One Day Return"
            value={`₹${(summary?.oneDayReturnValue || 0).toLocaleString()}`}
            subValue="Today's P&L"
            isPositive={summary?.oneDayReturnValue > 0}
            icon={TrendingUp}
          />
          <StatCard
            title="Projected Value"
            value={`₹${(summary?.projectedValue || 0).toLocaleString()}`}
            subValue="Est. Next Month"
            isPositive={true}
            icon={TrendingUp}
          />
        </div>

        {/* --- CHARTS SECTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
            <h3 className="text-lg font-bold text-white mb-4">Asset Diversification</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={diversification || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {(diversification || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg flex flex-col justify-center items-center text-center">
            <div className="p-4 bg-slate-700/50 rounded-full mb-4">
              <TrendingUp size={32} className="text-blue-500" />
            </div>
            <h3 className="text-lg font-bold text-white">Market Trends</h3>
            <p className="text-slate-400 mt-2 max-w-sm">
              View live market data and analyze historical performance.
            </p>
            <button
              onClick={() => onNavigate('stocks')} // This triggers the navigation
              className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm font-medium"
            >
              Go to Stocks
            </button>
          </div>
        </div>

        {/* --- BOTTOM SECTION: Recent Activity --- */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-lg overflow-hidden">
            <div className="p-6 border-b border-slate-700 flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">Recent Activity</h3>
                <button
                  onClick={() => onNavigate('transactions')} // This triggers the navigation
                  className="text-blue-400 text-sm hover:text-blue-300 flex items-center gap-1 transition"
                >
                    View All <ArrowRight size={16}/>
                </button>
            </div>
            <div className="divide-y divide-slate-700">
                {recentTx.length > 0 ? recentTx.map((tx) => (
                    <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-slate-700/30 transition">
                        <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-lg ${tx.type === 'BUY' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                {tx.type === 'BUY' ? <ArrowDownLeft size={18}/> : <ArrowUpRight size={18}/>}
                            </div>
                            <div>
                                <p className="text-white font-medium">{tx.asset}</p>
                                <p className="text-xs text-slate-400">{tx.date}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-white font-bold">{tx.total}</p>
                            <p className={`text-xs font-medium ${tx.type === 'BUY' ? 'text-green-400' : 'text-red-400'}`}>
                                {tx.type}
                            </p>
                        </div>
                    </div>
                )) : (
                    <div className="p-6 text-center text-slate-500 text-sm">No recent transactions found.</div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;