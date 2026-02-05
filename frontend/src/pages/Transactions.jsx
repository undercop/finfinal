

import React, { useEffect, useState } from 'react';
import { getTransactions } from '../services/api'; // <--- 1. Import the service
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2 } from 'lucide-react';

const Transactions = () => {
  // 2. State to hold data
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // 3. Fetch data on load
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getTransactions(); // <--- Call the API
        setTransactions(data);
      } catch (error) {
        console.error("Failed to load transactions", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-blue-500 animate-pulse font-medium">Loading History...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Transaction History</h1>
          <p className="text-slate-400 mt-1">View your recent trades and transfers.</p>
        </div>

        {/* Transactions Table Container */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-800/50">
                  <th className="p-4 text-xs font-semibold tracking-wide text-slate-400 uppercase">Type</th>
                  <th className="p-4 text-xs font-semibold tracking-wide text-slate-400 uppercase">Asset</th>
                  <th className="p-4 text-xs font-semibold tracking-wide text-slate-400 uppercase">Date</th>
                  <th className="p-4 text-xs font-semibold tracking-wide text-slate-400 uppercase">Status</th>
                  <th className="p-4 text-xs font-semibold tracking-wide text-slate-400 uppercase text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {/* 4. Map over the 'transactions' state */}
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-800/50 transition duration-150 ease-in-out">

                    {/* Type & Icon */}
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          tx.type === 'BUY' || tx.type === 'DEPOSIT'
                            ? 'bg-green-500/10 text-green-500'
                            : 'bg-red-500/10 text-red-500'
                        }`}>
                          {tx.type === 'BUY' || tx.type === 'DEPOSIT'
                            ? <ArrowDownLeft size={18} />
                            : <ArrowUpRight size={18} />}
                        </div>
                        <span className="font-medium text-slate-200">{tx.type}</span>
                      </div>
                    </td>

                    {/* Asset Details */}
                    <td className="p-4">
                      <div className="font-medium text-white">{tx.asset}</div>
                      <div className="text-xs text-slate-500">{tx.amount}</div>
                    </td>

                    {/* Date */}
                    <td className="p-4 text-slate-400 text-sm">
                      {tx.date}
                    </td>

                    {/* Status Badge */}
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        tx.status === 'Completed'
                          ? 'bg-green-500/10 text-green-400 border-green-500/20'
                          : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                      }`}>
                        {tx.status === 'Completed' ? <CheckCircle2 size={12} className="mr-1"/> : <Clock size={12} className="mr-1"/>}
                        {tx.status}
                      </span>
                    </td>

                    {/* Total Value */}
                    <td className={`p-4 text-right font-bold ${
                      tx.type === 'BUY' || tx.type === 'DEPOSIT' ? 'text-green-400' : 'text-white'
                    }`}>
                      {tx.type === 'DEPOSIT' ? '+' : ''}{tx.total}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;