export const mockData = {
  email: 'demo@example.com',
  password: 'demo123',
  session: 'mock-session-id-12345',
  accounts: [
    {
      id: '1',
      name: 'Demo Account',
      description: 'Mock account for demonstration',
      gain: 15.5,
      deposits: 10000,
      interest: 2.5,
      balance: 11550,
      drawdown: 5.2
    }
  ],
  watchedAccounts: [
    {
      name: 'Watched Demo',
      gain: 8.3,
      drawdown: 3.1,
      change: 1.2
    }
  ],
  openOrders: [
    {
      openDate: '2023-03-15T10:30:00Z',
      symbol: 'EURUSD',
      action: 'Buy',
      openPrice: 1.0850,
      tp: 1.0900,
      sl: 1.0800,
      comment: 'Demo order'
    }
  ],
  openTrades: [
    {
      openDate: '2023-03-14T14:45:00Z',
      symbol: 'GBPUSD',
      action: 'Sell',
      openPrice: 1.2150,
      profit: -25.5,
      pips: -20,
      swap: -1.2
    }
  ],
  tradeHistory: [
    {
      openDate: '2023-03-10T09:15:00Z',
      closeDate: '2023-03-11T16:30:00Z',
      symbol: 'USDJPY',
      action: 'Buy',
      profit: 75.3,
      pips: 60,
      comment: 'Closed with profit'
    }
  ],
  dailyGain: [
    { date: '2023-03-13', gain: 1.2, profit: 120 },
    { date: '2023-03-14', gain: -0.5, profit: -50 },
    { date: '2023-03-15', gain: 0.8, profit: 80 }
  ],
  totalGain: 15.5
};