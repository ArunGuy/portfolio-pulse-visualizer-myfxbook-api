export const mockData = {
  email: 'demo@example.com',
  password: 'demo123',
  session: 'mock-session-id-12345',
  accounts: [
    {
      id: '1',
      name: 'Demo Account 1',
      description: 'Mock account for demonstration',
      gain: 145.5,
      deposits: 10000,
      interest: 2.5,
      balance: 24550,
      drawdown: 5.2
    },
    {
      id: '2',
      name: 'Demo Account 2',
      description: 'Secondary mock account',
      gain: 132.7,
      deposits: 5000,
      interest: 1.8,
      balance: 11635,
      drawdown: 8.7
    },
    {
      id: '3',
      name: 'Demo Account 3',
      description: 'Tertiary mock account',
      gain: 158.2,
      deposits: 15000,
      interest: 3.1,
      balance: 38930,
      drawdown: 2.9
    }
  ],
  watchedAccounts: [
    {
      name: 'Watched Demo 1',
      gain: 83.4,
      drawdown: 3.1,
      change: 12.5
    },
    {
      name: 'Watched Demo 2',
      gain: 65.7,
      drawdown: 6.7,
      change: 9.8
    },
    {
      name: 'Watched Demo 3',
      gain: 92.1,
      drawdown: 4.3,
      change: 15.2
    }
  ],
  openOrders: [
    {
      openDate: '2024-08-15T10:30:00Z',
      symbol: 'EURUSD',
      action: 'Buy',
      openPrice: 1.0850,
      tp: 1.0900,
      sl: 1.0800,
      comment: 'Demo order 1'
    },
    {
      openDate: '2024-08-16T14:45:00Z',
      symbol: 'GBPJPY',
      action: 'Sell',
      openPrice: 182.50,
      tp: 181.50,
      sl: 183.50,
      comment: 'Demo order 2'
    }
  ],
  openTrades: [
    {
      openDate: '2024-08-14T14:45:00Z',
      symbol: 'GBPUSD',
      action: 'Sell',
      openPrice: 1.2150,
      profit: -125.5,
      pips: -100,
      swap: -12.0
    },
    {
      openDate: '2024-08-15T09:30:00Z',
      symbol: 'USDJPY',
      action: 'Buy',
      openPrice: 145.30,
      profit: 842.8,
      pips: 700,
      swap: -80.0
    }
  ],
  tradeHistory: [
    {
      openDate: '2024-08-10T09:15:00Z',
      closeDate: '2024-08-11T16:30:00Z',
      symbol: 'USDJPY',
      action: 'Buy',
      profit: 975.3,
      pips: 800,
      comment: 'Closed with profit'
    },
    {
      openDate: '2024-08-12T11:00:00Z',
      closeDate: '2024-08-13T14:45:00Z',
      symbol: 'EURUSD',
      action: 'Sell',
      profit: -532.6,
      pips: -450,
      comment: 'Closed with loss'
    },
    {
      openDate: '2024-08-14T10:30:00Z',
      closeDate: '2024-08-15T15:15:00Z',
      symbol: 'GBPJPY',
      action: 'Buy',
      profit: 1105.2,
      pips: 900,
      comment: 'Closed with significant profit'
    }
  ],
  dailyGain: [
    { date: '2023-08-01', gain: 0.5, profit: 50 },
    { date: '2023-08-02', gain: 0.4, profit: 40 },
    { date: '2023-08-03', gain: 0.6, profit: 60 },
    // ... other dates for the first half of the year with modest gains
    { date: '2024-07-01', gain: 1.2, profit: 150 },
    { date: '2024-07-02', gain: 1.5, profit: 180 },
    { date: '2024-07-03', gain: 1.8, profit: 220 },
    // ... rapid gains in the last few months
    { date: '2024-08-30', gain: 4.5, profit: 600 },
    { date: '2024-08-31', gain: 5.0, profit: 700 }
  ],
  totalGain: 350.7 // Represents significant growth, especially in the last year
};
