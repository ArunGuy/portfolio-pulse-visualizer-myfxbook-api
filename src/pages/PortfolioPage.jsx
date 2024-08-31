import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RefreshCw, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { getMyAccounts, getOpenTrades, getDataDaily, logout } from '../services/myfxbookApi';

// Define mock data
const mockAccounts = [
  { name: "Demo Account 1", balance: "1000", equity: "1050", gain: "5.00" },
  { name: "Demo Account 2", balance: "2000", equity: "2100", gain: "5.00" },
];

const mockOpenTrades = [
  { ticket: "12345", symbol: "EUR/USD", type: "Buy", lots: "1.00", openPrice: "1.10000", currentPrice: "1.10500", profit: "50.00" },
  { ticket: "12346", symbol: "GBP/USD", type: "Sell", lots: "0.50", openPrice: "1.30000", currentPrice: "1.29500", profit: "25.00" },
];

const mockDailyData = [
  { date: "2024-08-01", gain: 10 },
  { date: "2024-08-02", gain: 20 },
  { date: "2024-08-03", gain: -5 },
];

const PortfolioPage = () => {
  const [timeRange, setTimeRange] = useState('1M');
  const [accounts, setAccounts] = useState([]);
  const [openTrades, setOpenTrades] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [accountName, setAccountName] = useState('Loading...');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [session, setSession] = useState(null);

  const fetchData = async () => {
    if (!session) {
      console.log('Session is null, skipping fetchData.');
      setAccounts(mockAccounts);
      setOpenTrades(mockOpenTrades);
      setDailyData(mockDailyData);
      setAccountName('Mock Account');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    console.log('Fetching data with session:', session);

    try {
      const accountsData = await getMyAccounts(session);
      console.log('Fetched accounts data:', accountsData);

      if (accountsData && accountsData.length > 0) {
        setAccounts(accountsData);
        setAccountName(accountsData[0]?.name || 'Demo Account');
      } else {
        console.warn('No accounts data returned, using mock data.');
        setAccounts(mockAccounts);
        setAccountName('Mock Account');
      }

      const allOpenTrades = await Promise.all(
        accountsData.map(account => getOpenTrades(session, account['@_id']))
      );
      console.log('Fetched open trades data:', allOpenTrades);
      setOpenTrades(allOpenTrades.flat());

      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(endDate.getMonth() - getTimeRangeInMonths(timeRange));

      const allDailyData = await Promise.all(
        accountsData.map(account => getDataDaily(session, account['@_id'], startDate.toISOString(), endDate.toISOString()))
      );
      console.log('Fetched daily data:', allDailyData);
      setDailyData(allDailyData.flat());
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Unable to fetch data. Please try again later.');
      // Use mock data when there's an error
      setAccounts(mockAccounts);
      setOpenTrades(mockOpenTrades);
      setDailyData(mockDailyData);
      setAccountName('Mock Account');
    } finally {
      setIsLoading(false);
      console.log('Data loading complete');
    }
  };

  useEffect(() => {
    console.log('Current session:', session);
    if (session) {
      fetchData();
    } else {
      console.log('Session is null, using mock data.');
      setAccounts(mockAccounts);
      setOpenTrades(mockOpenTrades);
      setDailyData(mockDailyData);
      setAccountName('Mock Account');
      setIsLoading(false);
    }
  }, [session, timeRange]);

  const getTimeRangeInMonths = (range) => {
    switch (range) {
      case '1M': return 1;
      case '3M': return 3;
      case '6M': return 6;
      case '1Y': return 12;
      default: return 1;
    }
  };

  const handleRefresh = () => {
    if (session) {
      console.log('Refreshing data with session:', session);
      fetchData();
    } else {
      console.log('Session is null, cannot refresh data.');
    }
  };

  const handleLogout = async () => {
    try {
      console.log('Logging out with session:', session);
      await logout(session);
      setSession(null);
      // Navigate to login page or clear other session-related state
      console.log('Logged out successfully');
    } catch (err) {
      console.error('Logout error:', err);
      setError('Failed to logout. Please try again.');
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading data...</div>;
  }

  if (error) {
    return (
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
        <p className="font-bold">Warning</p>
        <p>{error}</p>
      </div>
    );
  }

  const totalBalance = accounts.reduce((sum, account) => sum + parseFloat(account.balance), 0);
  const totalEquity = accounts.reduce((sum, account) => sum + parseFloat(account.equity), 0);
  const totalGain = totalBalance > 0 ? ((totalEquity - totalBalance) / totalBalance * 100).toFixed(2) : '0.00';

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Forex Portfolio Overview - {accountName}</h1>
        <div className="flex items-center space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1M">1 Month</SelectItem>
              <SelectItem value="3M">3 Months</SelectItem>
              <SelectItem value="6M">6 Months</SelectItem>
              <SelectItem value="1Y">1 Year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh
          </Button>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${totalBalance.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Equity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${totalEquity.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Gain</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold flex items-center ${parseFloat(totalGain) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalGain}%
              {parseFloat(totalGain) >= 0 ? <ArrowUpRight className="ml-2" /> : <ArrowDownRight className="ml-2" />}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Open Trades</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{openTrades.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Open Trades and Daily Data */}
      <Tabs defaultValue="openTrades" className="mb-6">
        <TabsList>
          <TabsTrigger value="openTrades">Open Trades</TabsTrigger>
          <TabsTrigger value="dailyData">Daily Data</TabsTrigger>
        </TabsList>
        <TabsContent value="openTrades">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lots</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Open Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {openTrades.map((trade) => (
                <tr key={trade.ticket}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{trade.ticket}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{trade.symbol}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{trade.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{trade.lots}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{trade.openPrice}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{trade.currentPrice}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${trade.profit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TabsContent>
        <TabsContent value="dailyData">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={dailyData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="gain" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PortfolioPage;
