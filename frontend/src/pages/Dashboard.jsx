import React, { useEffect, useState } from 'react';
import { getDashboardData } from '../services/api'; // Import the service
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Wallet } from 'lucide-react';

// Reusable Stat Card Component
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

const Dashboard = () => {
  // 1. State to hold the data
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 2. Fetch data on load
  useEffect(() => {
    const loadData = async () => {
      const result = await getDashboardData();
      setData(result);
      setLoading(false);
    };
    loadData();
  }, []);

  // 3. Show loading state
  if (loading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-blue-500">Loading Dashboard...</div>;
  }

  // 4. Use the data (Now it works for both Mock AND Real!)
  const { summary, diversification, user } = data;

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 mt-1">Welcome back, {user.name}. Here is your portfolio overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Balance"
            value={`$${user.balance.toLocaleString()}`}
            icon={Wallet}
            isPositive={true}
          />
          <StatCard
            title="Portfolio Value"
            value={`$${summary.totalPortfolioValue.toLocaleString()}`}
            subValue={`+${summary.oneDayReturn}%`}
            isPositive={summary.oneDayReturn > 0}
            icon={DollarSign}
          />
          <StatCard
            title="One Day Return"
            value={`$${summary.oneDayReturnValue}`}
            subValue="Today's P&L"
            isPositive={summary.oneDayReturnValue > 0}
            icon={TrendingUp}
          />
          <StatCard
            title="Projected Value"
            value={`$${summary.projectedValue.toLocaleString()}`}
            subValue="Est. Next Month"
            isPositive={true}
            icon={TrendingUp}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Diversification Chart */}
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
            <h3 className="text-lg font-bold text-white mb-4">Asset Diversification</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={diversification}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {diversification.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Placeholder for Recent Activity/Stocks Table */}
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg flex flex-col justify-center items-center text-center">
            <div className="p-4 bg-slate-700/50 rounded-full mb-4">
              <TrendingUp size={32} className="text-blue-500" />
            </div>
            <h3 className="text-lg font-bold text-white">Market Trends</h3>
            <p className="text-slate-400 mt-2 max-w-sm">
              Connect the "Stocks" page here to visualize market trends and historical performance.
            </p>
            <button className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm font-medium">
              View Market
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;