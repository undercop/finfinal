import React, { useEffect, useState } from 'react';
import { getRiskAnalysis, getCriticalAlerts, getRebalanceSuggestions } from '../services/api';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ShieldAlert, TrendingUp, TrendingDown, Info, AlertTriangle, CheckCircle, Scale, ArrowRight, Sparkles, Loader2 } from 'lucide-react';

const Performance = () => {
  // Main Data States
  const [data, setData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Rebalancing States (Separate from main loader)
  const [rebalanceText, setRebalanceText] = useState("");
  const [loadingRebalance, setLoadingRebalance] = useState(false);

  // 1. Initial Load (Only cheap/fast APIs)
  useEffect(() => {
    const loadData = async () => {
      try {
        const [riskResult, alertsResult] = await Promise.all([
          getRiskAnalysis(),
          getCriticalAlerts()
        ]);

        setData(riskResult);
        setAlerts(alertsResult);
      } catch (error) {
        console.error("Error loading performance data", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // 2. Handler for the "Generate" Button
  const handleGenerateRebalance = async () => {
    setLoadingRebalance(true);
    const result = await getRebalanceSuggestions();
    setRebalanceText(result);
    setLoadingRebalance(false);
  };

  // Helper: Parse text to cards
  const parseRebalanceText = (text) => {
    if (!text) return [];
    return text.split('\n')
      .filter(line => line.trim().startsWith('*'))
      .map(line => {
        const cleanLine = line.replace(/\*/g, '').trim();
        const parts = cleanLine.split(':');
        return {
          title: parts[0] ? parts[0].trim() : "Suggestion",
          desc: parts[1] ? parts[1].trim() : parts[0]
        };
      });
  };

  const rebalanceSuggestions = parseRebalanceText(rebalanceText);

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-blue-500 animate-pulse">Analyzing Portfolio Risk...</div>;
  if (!data) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500">Analysis unavailable.</div>;

  // Chart Config
  const exposureData = Object.keys(data.categoryExposure).map(key => ({
    name: key.replace('_', ' '),
    value: data.categoryExposure[key]
  }));

  const riskDimensions = [
    { name: 'Concentration', value: data.dimensionScores.concentrationRisk },
    { name: 'Growth Bias', value: data.dimensionScores.growthBiasRisk },
    { name: 'Allocation', value: data.dimensionScores.allocationRisk },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const getRiskColor = (label) => {
    if (label === 'Conservative') return 'text-green-400 border-green-500/30 bg-green-500/10';
    if (label === 'Moderate') return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
    return 'text-red-400 border-red-500/30 bg-red-500/10';
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Portfolio Performance & Risk AI</h1>
          <p className="text-slate-400">Deep dive analysis of your portfolio's health and exposure.</p>
        </div>

        {/* CRITICAL ALERTS */}
        {alerts.length > 0 ? (
          <div className="space-y-4">
             <h3 className="font-bold text-white flex items-center gap-2">
                <AlertTriangle className="text-yellow-500" size={20} />
                Critical Market Alerts
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {alerts.map((alert, idx) => (
                 <div key={idx} className={`p-4 rounded-xl border flex items-start gap-4 ${alert.type === 'WARNING' ? 'bg-red-500/5 border-red-500/20' : 'bg-green-500/5 border-green-500/20'}`}>
                   <div className={`p-3 rounded-lg ${alert.type === 'WARNING' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                     {alert.type === 'WARNING' ? <TrendingDown size={24}/> : <TrendingUp size={24}/>}
                   </div>
                   <div className="flex-1">
                     <div className="flex justify-between items-start">
                        <h4 className="font-bold text-slate-200">{alert.assetName}</h4>
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${alert.type === 'WARNING' ? 'text-red-400 bg-red-500/10' : 'text-green-400 bg-green-500/10'}`}>
                          {alert.changePercent > 0 ? '+' : ''}{alert.changePercent.toFixed(2)}%
                        </span>
                     </div>
                     <p className="text-sm text-slate-400 mt-1">{alert.message}</p>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        ) : (
          <div className="bg-green-500/5 border border-green-500/20 p-4 rounded-xl flex items-center gap-3">
             <CheckCircle className="text-green-500" size={20}/>
             <p className="text-green-400 text-sm font-medium">No critical alerts. Your portfolio is stable.</p>
          </div>
        )}

        {/* RISK SCORE & SUMMARY */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <ShieldAlert size={100} className="text-white"/>
            </div>
            <h3 className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-4">Overall Risk Score</h3>
            <div className="text-6xl font-black text-white mb-2">{data.riskScore} <span className="text-xl text-slate-500">/ 5</span></div>
            <span className={`px-4 py-1 rounded-full text-sm font-bold border ${getRiskColor(data.riskLabel)}`}>
              {data.riskLabel}
            </span>
          </div>

          <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-8 flex flex-col justify-center">
             <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
                   <TrendingUp size={24} />
                </div>
                <div>
                   <h3 className="text-xl font-bold text-white mb-2">AI Assessment</h3>
                   <p className="text-slate-300 leading-relaxed text-lg">"{data.summary}"</p>
                </div>
             </div>
          </div>
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="font-bold text-white mb-6">Asset Allocation</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={exposureData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {exposureData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} formatter={(value) => `${value.toFixed(1)}%`}/>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="font-bold text-white mb-6">Risk Dimensions</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={riskDimensions} layout="vertical">
                  <XAxis type="number" domain={[0, 5]} hide />
                  <YAxis type="category" dataKey="name" stroke="#94a3b8" width={100} tick={{fontSize: 12}} />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }}/>
                  <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20}>
                    {riskDimensions.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.value > 2.5 ? '#ef4444' : '#3b82f6'} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-center text-slate-500 mt-2">Scale: 0 (Safe) - 5 (Critical)</p>
          </div>
        </div>

        {/* AI REBALANCING SECTION (On-Demand) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Scale size={20} className="text-blue-500"/>
              Strategic Rebalancing Plan
            </h3>
          </div>

          {!rebalanceText ? (
             // STATE 1: Empty - Show Button
             <div className="text-center py-10 bg-slate-950/50 rounded-xl border border-dashed border-slate-800">
                <Sparkles size={40} className="mx-auto text-blue-500 mb-4 opacity-80" />
                <h4 className="text-white font-bold text-lg mb-2">Generate AI Rebalancing Strategy</h4>
                <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
                  Use our advanced AI to analyze your holdings and generate a step-by-step plan to optimize your portfolio for better risk-adjusted returns.
                </p>
                <button
                  onClick={handleGenerateRebalance}
                  disabled={loadingRebalance}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold flex items-center gap-2 mx-auto transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingRebalance ? <Loader2 className="animate-spin"/> : <Sparkles size={18}/>}
                  {loadingRebalance ? "Analyzing Portfolio..." : "Generate AI Plan"}
                </button>
             </div>
          ) : (
            // STATE 2: Data Loaded - Show Cards
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {rebalanceSuggestions.map((suggestion, idx) => (
                <div key={idx} className="bg-slate-950 p-5 rounded-xl border border-slate-800 hover:border-blue-500/50 transition duration-300 group">
                  <div className="flex items-start gap-3">
                    <div className={`mt-1 p-1 rounded-full ${
                      suggestion.title.toLowerCase().includes('increase') ? 'bg-green-500/20 text-green-400' :
                      suggestion.title.toLowerCase().includes('decrease') ? 'bg-red-500/20 text-red-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      <ArrowRight size={16} />
                    </div>
                    <div>
                      <h4 className={`font-bold text-sm uppercase tracking-wide mb-2 ${
                        suggestion.title.toLowerCase().includes('increase') ? 'text-green-400' :
                        suggestion.title.toLowerCase().includes('decrease') ? 'text-red-400' :
                        'text-blue-400'
                      }`}>
                        {suggestion.title}
                      </h4>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {suggestion.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* GENERAL INSIGHTS */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <Info size={18} className="text-blue-500"/> General Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.insights.map((insight, idx) => (
              <div key={idx} className="bg-slate-950/50 p-4 rounded-lg border border-slate-800/50 flex gap-3">
                 <div className="h-2 w-2 mt-2 rounded-full bg-blue-500 shrink-0"></div>
                 <p className="text-slate-300 text-sm">{insight}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Performance;