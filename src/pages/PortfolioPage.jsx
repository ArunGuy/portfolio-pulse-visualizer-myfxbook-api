import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { RefreshCw, ArrowUpRight, ArrowDownRight, AlertCircle, Filter } from "lucide-react";
import { login, getMyAccounts, getOpenTrades, getAccountHistory, getDailyGain, getTotalGain, logout, getWatchedAccounts, getOpenOrders } from '../services/myfxbookApi.jsx';
import { mockData } from '../mockData.js';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { addDays, format } from "date-fns";

const PortfolioPage = () => {
  const [session, setSession] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [watchedAccounts, setWatchedAccounts] = useState([]);
  const [openTrades, setOpenTrades] = useState([]);
  const [tradeHistory, setTradeHistory] = useState([]);
  const [dailyGain, setDailyGain] = useState([]);
  const [totalGain, setTotalGain] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('');
  const [openOrders, setOpenOrders] = useState([]);

  const [dateRange, setDateRange] = useState({
    from: addDays(new Date(), -30),
    to: new Date(),
  });

  useEffect(() => {
    if (session) {
      fetchData();
    }
  }, [session, selectedAccount]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const sessionId = await login(email, password);
      setSession(sessionId);
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout(session);
      setSession('');
      setAccounts([]);
      setWatchedAccounts([]);
      setOpenTrades([]);
      setTradeHistory([]);
      setDailyGain([]);
      setTotalGain(0);
    } catch (err) {
      setError('Logout failed. Please try again.');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [accountsData, watchedAccountsData] = await Promise.all([
        getMyAccounts(session),
        getWatchedAccounts(session)
      ]);
      setAccounts(accountsData);
      setWatchedAccounts(watchedAccountsData);

      if (selectedAccount) {
        const [openTradesData, tradeHistoryData, dailyGainData, totalGainData, openOrdersData] = await Promise.all([
          getOpenTrades(session, selectedAccount),
          getAccountHistory(session, selectedAccount),
          getDailyGain(session, selectedAccount, format(dateRange.from, 'yyyy-MM-dd'), format(dateRange.to, 'yyyy-MM-dd')),
          getTotalGain(session, selectedAccount, format(dateRange.from, 'yyyy-MM-dd'), format(dateRange.to, 'yyyy-MM-dd')),
          getOpenOrders(session, selectedAccount)
        ]);
        setOpenTrades(openTradesData);
        setTradeHistory(tradeHistoryData);
        setDailyGain(dailyGainData);
        setTotalGain(totalGainData);
        setOpenOrders(openOrdersData);
      }
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderLoginForm = () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Login to MyFXBook</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
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

  const renderDashboard = () => (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">MyFXBook Portfolio</h1>
        <div className="flex items-center space-x-4">
          <Select value={selectedAccount} onValueChange={setSelectedAccount}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={fetchData} disabled={loading}>
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh
          </Button>
          <Button onClick={handleLogout} variant="outline">Logout</Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Gain</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalGain.toFixed(2)}%</div>
          </CardContent>
        </Card>
        {/* Add more summary cards here */}
      </div>

      <Tabs defaultValue="overview" className="mb-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="openTrades">Open Trades</TabsTrigger>
          <TabsTrigger value="history">Trade History</TabsTrigger>
          <TabsTrigger value="watchedAccounts">Watched Accounts</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  Daily Gain
                  <div className="flex space-x-2">
                    <Calendar
                      mode="single"
                      selected={dateRange.from}
                      onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                      className="rounded-md border"
                    />
                    <Calendar
                      mode="single"
                      selected={dateRange.to}
                      onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                      className="rounded-md border"
                    />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dailyGain}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            {/* Add more overview charts here */}
          </div>
        </TabsContent>

        <TabsContent value="openTrades">
          <Card>
            <CardHeader>
              <CardTitle>Open Trades</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Open Date</TableHead>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Open Price</TableHead>
                    <TableHead>Profit</TableHead>
                    <TableHead>Pips</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {openTrades.map((trade, index) => (
                    <TableRow key={index}>
                      <TableCell>{trade.openDate}</TableCell>
                      <TableCell>{trade.symbol}</TableCell>
                      <TableCell>{trade.action}</TableCell>
                      <TableCell>{trade.openPrice}</TableCell>
                      <TableCell>{trade.profit}</TableCell>
                      <TableCell>{trade.pips}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Add more tab content for history, watched accounts, and analysis */}
      </Tabs>

      {/* Add more dashboard components here */}
    </div>
  );

  return session ? renderDashboard() : renderLoginForm();
};

export default PortfolioPage;