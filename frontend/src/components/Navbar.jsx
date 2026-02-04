import React, { useState } from 'react';
  import { Bell, User, Menu } from 'lucide-react';


  // 1. We accept 'onNavigate' as a prop here
  const Navbar = ({ onNavigate }) => {
    const [showAlerts, setShowAlerts] = useState(false);

    // Hardcoded for UI as requested, but pulled from mock in real app
    const alerts = [
      { id: 1, text: "Apple stock rose by 5% today", time: "2m ago" },
      { id: 2, text: "Transaction #404 completed", time: "1h ago" }
    ];

    return (
      <nav className="bg-slate-900 border-b border-slate-800 text-slate-100 p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo / Brand */}
          <div className="text-xl font-bold tracking-wider text-blue-500">
            PORTFOLIO<span className="text-white">MANAGER</span>
          </div>

          {/* Desktop Links - UPDATED TO BUTTONS */}
          <div className="hidden md:flex space-x-8 text-sm font-medium text-slate-400">
            <button
              onClick={() => onNavigate('dashboard')}
              className="hover:text-blue-400 text-white transition"
            >
              Dashboard
            </button>
            <button
              onClick={() => onNavigate('transactions')}
              className="hover:text-blue-400 transition"
            >
              Transactions
            </button>
            <button
              onClick={() => onNavigate('stocks')}
              className="hover:text-blue-400 transition"
            >
              Stocks
            </button>
            <button
              onClick={() => onNavigate('holdings')}
              className="hover:text-blue-400 transition"
            >
              Holdings
            </button>
          </div>

          {/* Right Side: Alerts & Profile */}
          <div className="flex items-center space-x-6">

            {/* Alerts Section */}
            <div className="relative">
              <button
                onClick={() => setShowAlerts(!showAlerts)}
                className="relative p-2 hover:bg-slate-800 rounded-full transition"
              >
                <Bell size={20} className="text-slate-300" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Alerts Dropdown */}
              {showAlerts && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-700 text-xs font-bold text-slate-400 uppercase">
                    Notifications
                  </div>
                  {alerts.map((alert) => (
                    <div key={alert.id} className="px-4 py-3 hover:bg-slate-700 cursor-pointer">
                      <p className="text-sm text-slate-200">{alert.text}</p>
                      <p className="text-xs text-slate-500 mt-1">{alert.time}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* User Profile */}
            <div className="flex items-center space-x-3 pl-6 border-l border-slate-800">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-white">Raj</p>
                <p className="text-xs text-slate-500">Premium User</p>
              </div>
              <div className="h-10 w-10 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-full flex items-center justify-center shadow-lg">
                <User size={20} className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  };

  export default Navbar;