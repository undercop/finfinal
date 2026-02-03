// Export 1: Dashboard Data
export const mockDashboardData = {
  user: {
    name: "Raj",
    balance: 12450.00,
  },
  summary: {
    totalPortfolioValue: 45230.50,
    oneDayReturn: 2.4, // Percentage
    oneDayReturnValue: 1085.53,
    projectedValue: 48500.00, // E.g., next month projection
  },
  diversification: [
    { name: 'Tech', value: 400, color: '#3b82f6' }, // Blue
    { name: 'Finance', value: 300, color: '#10b981' }, // Green
    { name: 'Energy', value: 300, color: '#f59e0b' }, // Amber
    { name: 'Pharma', value: 200, color: '#8b5cf6' }, // Purple
  ],
  alerts: [
    { id: 1, message: "NFLX up by 5%", type: "success" },
    { id: 2, message: "Balance low", type: "warning" }
  ]
};

// Export 2: Transactions Data (Separate from the object above)
export const mockTransactions = [
  { id: 1, type: 'BUY', asset: 'AAPL', amount: '10 Shares', price: '$145.00', total: '$1,450.00', date: '2023-10-24', status: 'Completed' },
  { id: 2, type: 'SELL', asset: 'TSLA', amount: '5 Shares', price: '$210.00', total: '$1,050.00', date: '2023-10-22', status: 'Completed' },
  { id: 3, type: 'DEPOSIT', asset: 'USD', amount: '-', price: '-', total: '$5,000.00', date: '2023-10-20', status: 'Completed' },
  { id: 4, type: 'BUY', asset: 'BTC', amount: '0.05 BTC', price: '$34,000', total: '$1,700.00', date: '2023-10-18', status: 'Pending' },
  { id: 5, type: 'DIVIDEND', asset: 'MSFT', amount: '-', price: '-', total: '$45.20', date: '2023-10-15', status: 'Completed' },
];
// Export 3: Stocks & Chart Data
export const mockStockData = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    shares: 15,
    price: 173.50,
    change: "+1.2%",
    isPositive: true,
    history: [
      { day: 'Mon', price: 168 },
      { day: 'Tue', price: 170 },
      { day: 'Wed', price: 172 },
      { day: 'Thu', price: 171 },
      { day: 'Fri', price: 173.5 },
    ]
  },
  {
    symbol: "TSLA",
    name: "Tesla, Inc.",
    shares: 5,
    price: 210.00,
    change: "-2.5%",
    isPositive: false,
    history: [
      { day: 'Mon', price: 225 },
      { day: 'Tue', price: 222 },
      { day: 'Wed', price: 218 },
      { day: 'Thu', price: 215 },
      { day: 'Fri', price: 210 },
    ]
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    shares: 10,
    price: 135.20,
    change: "+0.8%",
    isPositive: true,
    history: [
      { day: 'Mon', price: 131 },
      { day: 'Tue', price: 132 },
      { day: 'Wed', price: 133 },
      { day: 'Thu', price: 134 },
      { day: 'Fri', price: 135.2 },
    ]
  }
];