import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { RefreshCw, ArrowUpRight, ArrowDownRight, AlertCircle } from "lucide-react";
import { login, getMyAccounts, getOpenTrades, getDataDaily, getAccountHistory, getDailyGain, getTotalGain, logout } from '../services/myfxbookApi.jsx';
import { mockData } from '../mockData.js';

const PortfolioPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [session, setSession] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [openTrades, setOpenTrades] = useState([]);
  const [tradeHistory, setTradeHistory] = useState([]);
  const [dailyGain, setDailyGain] = useState([]);
  const [totalGain, setTotalGain] = useState(0);
  const [watchedAccounts, setWatchedAccounts] = useState([]);
  const [openOrders, setOpenOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (email === mockData.email && password === mockData.password) {
        // Use mock data
        setSession(mockData.session);
        setAccounts(mockData.accounts);
        setWatchedAccounts(mockData.watchedAccounts);
        setOpenOrders(mockData.openOrders);
        setOpenTrades(mockData.openTrades);
        setTradeHistory(mockData.tradeHistory);
        setDailyGain(mockData.dailyGain);
        setTotalGain(mockData.totalGain);
        setSelectedAccount(mockData.accounts[0].id);
      } else {
        // Use real API
        const sessionId = await login(email, password);
        if (sessionId) {
          setSession(sessionId);
          await fetchData(sessionId);
        } else {
          throw new Error('Login failed. Please check your credentials and try again.');
        }
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchData = async (sessionId) => {
    try {
      const accountsData = await getMyAccounts(sessionId);
      setAccounts(accountsData);
      if (accountsData.length > 0) {
        const defaultAccount = accountsData[0]['@_id'];
        setSelectedAccount(defaultAccount);
        const [openTradesData, historyData, dailyGainData, totalGainResult] = await Promise.all([
          getOpenTrades(sessionId, defaultAccount),
          getAccountHistory(sessionId, defaultAccount),
          getDailyGain(sessionId, defaultAccount, getStartDate(), new Date().toISOString()),
          getTotalGain(sessionId, defaultAccount, getStartDate(), new Date().toISOString())
        ]);
        setOpenTrades(openTradesData);
        setTradeHistory(historyData);
        setDailyGain(dailyGainData);
        setTotalGain(totalGainResult);
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching data.');
    }
  };

  const getStartDate = () => {
    const now = new Date();
    return new Date(now.setMonth(now.getMonth() - 1)).toISOString();
  };

  const handleLogout = () => {
    setSession(null);
    setAccounts([]);
    setSelectedAccount(null);
    setOpenTrades([]);
    setTradeHistory([]);
    setDailyGain([]);
    setTotalGain(0);
    setWatchedAccounts([]);
    setOpenOrders([]);
  };

  if (!session) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Login to MyFXBook</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
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
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
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

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Forex Portfolio Overview</h1>
        <Button onClick={handleLogout}>Logout</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${accounts[0]?.balance.toLocaleString()}</p>
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
        <Card>
          <CardHeader>
            <CardTitle>Drawdown</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">{accounts[0]?.drawdown.toFixed(2)}%</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="mb-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="openTrades">Open Trades</TabsTrigger>
          <TabsTrigger value="history">Trade History</TabsTrigger>
          <TabsTrigger value="watchedAccounts">Watched Accounts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Gain</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dailyGain}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="gain" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Open Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Symbol</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Open Price</TableHead>
                      <TableHead>TP</TableHead>
                      <TableHead>SL</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {openOrders.map((order, index) => (
                      <TableRow key={index}>
                        <TableCell>{order.symbol}</TableCell>
                        <TableCell>{order.action}</TableCell>
                        <TableCell>{order.openPrice}</TableCell>
                        <TableCell>{order.tp}</TableCell>
                        <TableCell>{order.sl}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
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
                    <TableHead>Profit</TableHead>
                    <TableHead>Pips</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {openTrades.map((trade, index) => (
                    <TableRow key={index}>
                      <TableCell>{new Date(trade.openDate).toLocaleString()}</TableCell>
                      <TableCell>{trade.symbol}</TableCell>
                      <TableCell>{trade.action}</TableCell>
                      <TableCell className={trade.profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {trade.profit.toFixed(2)}
                      </TableCell>
                      <TableCell>{trade.pips}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Trade History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Open Date</TableHead>
                    <TableHead>Close Date</TableHead>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Profit</TableHead>
                    <TableHead>Pips</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tradeHistory.map((trade, index) => (
                    <TableRow key={index}>
                      <TableCell>{new Date(trade.openDate).toLocaleString()}</TableCell>
                      <TableCell>{new Date(trade.closeDate).toLocaleString()}</TableCell>
                      <TableCell>{trade.symbol}</TableCell>
                      <TableCell>{trade.action}</TableCell>
                      <TableCell className={trade.profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {trade.profit.toFixed(2)}
                      </TableCell>
                      <TableCell>{trade.pips}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="watchedAccounts">
          <Card>
            <CardHeader>
              <CardTitle>Watched Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Gain</TableHead>
                    <TableHead>Drawdown</TableHead>
                    <TableHead>Change</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {watchedAccounts.map((account, index) => (
                    <TableRow key={index}>
                      <TableCell>{account.name}</TableCell>
                      <TableCell className={account.gain >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {account.gain.toFixed(2)}%
                      </TableCell>
                      <TableCell className="text-red-600">{account.drawdown.toFixed(2)}%</TableCell>
                      <TableCell className={account.change >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {account.change.toFixed(2)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PortfolioPage;