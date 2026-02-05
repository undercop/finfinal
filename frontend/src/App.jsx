import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Stocks from './pages/Stocks';
import Holdings from './pages/Holdings';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

 const renderPage = () => {
   switch (currentPage) {
     case 'dashboard':

       return <Dashboard onNavigate={setCurrentPage} />;

     case 'transactions':
       return <Transactions />;
     case 'stocks':
       return <Stocks />;
     case 'holdings':
       return <Holdings />;
     default:
       return <Dashboard onNavigate={setCurrentPage} />;
   }
 };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 font-sans">
      <Navbar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      />
      <main className="p-6">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
