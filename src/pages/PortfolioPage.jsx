import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw, ArrowUpRight, ArrowDownRight, AlertCircle } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { login, getMyAccounts, getOpenTrades, getDataDaily, getAccountHistory, getDailyGain, getTotalGain, logout } from '../services/myfxbookApi.jsx';

const PortfolioPage = () => {
  const [timeRange, setTimeRange] = useState('1M');
  const [accounts, setAccounts] = useState([]);
  const [openTrades, setOpenTrades] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [accountHistory, setAccountHistory] = useState([]);
  const [dailyGain, setDailyGain] = useState([]);
  const [totalGain, setTotalGain] = useState(0);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const sessionId = await login(email, password);
      if (sessionId) {
        setSession(sessionId);
        localStorage.setItem('sessionId', sessionId);
        fetchData(sessionId);
      } else {
        throw new Error('Login failed');
      }
    } catch (err) {
      setError('Login failed. Please check your credentials and try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [email, password]);

  const fetchData = useCallback(async (sessionId) => {
    if (!sessionId) return;

    setIsLoading(true);
    setError(null);

    try {
      const accountsData = await getMyAccounts(sessionId);
      setAccounts(accountsData);
      
      if (accountsData.length > 0) {
        const defaultAccount = selectedAccount || accountsData[0]['@_id'];
        setSelectedAccount(defaultAccount);

        const [openTradesData, dailyDataResult, accountHistoryData, dailyGainData, totalGainResult] = await Promise.all([
          getOpenTrades(sessionId, defaultAccount),
          getDataDaily(sessionId, defaultAccount, getStartDate(), new Date().toISOString()),
          getAccountHistory(sessionId, defaultAccount),
          getDailyGain(sessionId, defaultAccount, getStartDate(), new Date().toISOString()),
          getTotalGain(sessionId, defaultAccount, getStartDate(), new Date().toISOString())
        ]);

        setOpenTrades(openTradesData);
        setDailyData(dailyDataResult);
        setAccountHistory(accountHistoryData);
        setDailyGain(dailyGainData);
        setTotalGain(totalGainResult);
      }
    } catch (err) {
      if (err.message.includes('Invalid session')) {
        setError('Session expired. Please log in again.');
        setSession(null);
        localStorage.removeItem('sessionId');
      } else {
        setError(err.message || 'An error occurred while fetching data.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [selectedAccount, timeRange]);

  useEffect(() => {
    const storedSession = localStorage.getItem('sessionId');
    if (storedSession) {
      setSession(storedSession);
      fetchData(storedSession);
    }
  }, [fetchData]);

  const getStartDate = () => {
    const now = new Date();
    switch (timeRange) {
      case '1M': return new Date(now.setMonth(now.getMonth() - 1)).toISOString();
      case '3M': return new Date(now.setMonth(now.getMonth() - 3)).toISOString();
      case '6M': return new Date(now.setMonth(now.getMonth() - 6)).toISOString();
      case '1Y': return new Date(now.setFullYear(now.getFullYear() - 1)).toISOString();
      default: return new Date(now.setMonth(now.getMonth() - 1)).toISOString();
    }
  };

  const handleRefresh = () => fetchData(session);

  const handleLogout = async () => {
    try {
      await logout(session);
      setSession(null);
      localStorage.removeItem('sessionId');
      setAccounts([]);
      setSelectedAccount(null);
    } catch (err) {
      setError('Failed to logout. Please try again.');
    }
  };

  if (!session) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Card className="w-[300px]">
          <CardHeader>
            <CardTitle>Login to MyFXBook</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-4">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading data...</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const selectedAccountData = accounts.find(account => account['@_id'] === selectedAccount) || {};

  const winRate = accountHistory.reduce((acc, trade) => {
    return acc + (parseFloat(trade.profit) > 0 ? 1 : 0);
  }, 0) / accountHistory.length * 100;

  const averageProfitPerTrade = accountHistory.reduce((acc, trade) => {
    return acc + parseFloat(trade.profit);
  }, 0) / accountHistory.length;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Forex Portfolio Overview</h1>
        <div className="flex items-center space-x-4">
          <Select value={selectedAccount} onValueChange={setSelectedAccount}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map(account => (
                <SelectItem key={account['@_id']} value={account['@_id']}>{account.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
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
            <CardTitle>Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${parseFloat(selectedAccountData.balance).toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Equity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${parseFloat(selectedAccountData.equity).toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Gain</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold flex items-center ${totalGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalGain.toFixed(2)}%
              {totalGain >= 0 ? <ArrowUpRight className="ml-2" /> : <ArrowDownRight className="ml-2" />}
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

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="mb-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trades">Trades</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Equity Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dailyData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="equity" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Daily Gain</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dailyGain}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="gain" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Trades Tab */}
        <TabsContent value="trades">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Lots</TableHead>
                <TableHead>Open Price</TableHead>
                <TableHead>Current Price</TableHead>
                <TableHead>Profit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {openTrades.map(trade => (
                <TableRow key={trade.id}>
                  <TableCell>{trade.id}</TableCell>
                  <TableCell>{trade.symbol}</TableCell>
                  <TableCell>{trade.type}</TableCell>
                  <TableCell>{trade.lots}</TableCell>
                  <TableCell>{trade.openPrice}</TableCell>
                  <TableCell>{trade.currentPrice}</TableCell>
                  <TableCell className={parseFloat(trade.profit) >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {parseFloat(trade.profit).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Lots</TableHead>
                <TableHead>Open Time</TableHead>
                <TableHead>Close Time</TableHead>
                <TableHead>Profit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accountHistory.map(history => (
                <TableRow key={history.id}>
                  <TableCell>{history.id}</TableCell>
                  <TableCell>{history.symbol}</TableCell>
                  <TableCell>{history.type}</TableCell>
                  <TableCell>{history.lots}</TableCell>
                  <TableCell>{new Date(history.openTime).toLocaleString()}</TableCell>
                  <TableCell>{new Date(history.closeTime).toLocaleString()}</TableCell>
                  <TableCell className={parseFloat(history.profit) >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {parseFloat(history.profit).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Win Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Win', value: winRate },
                        { name: 'Loss', value: 100 - winRate }
                      ]}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      label
                    >
                      <Cell key="cell-0" fill="#82ca9d" />
                      <Cell key="cell-1" fill="#8884d8" />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
                <p className="text-center mt-4">Win Rate: {winRate.toFixed(2)}%</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>Total Trades: {accountHistory.length}</li>
                  <li>Win Rate: {winRate.toFixed(2)}%</li>
                  <li>Average Profit per Trade: ${averageProfitPerTrade.toFixed(2)}</li>
                  <li>Best Trade: ${Math.max(...accountHistory.map(t => parseFloat(t.profit))).toFixed(2)}</li>
                  <li>Worst Trade: ${Math.min(...accountHistory.map(t => parseFloat(t.profit))).toFixed(2)}</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PortfolioPage;