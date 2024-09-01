import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { RefreshCw, ArrowUpRight, AlertCircle } from "lucide-react";
import { login, getMyAccounts, getOpenTrades, getAccountHistory, getDailyGain, getTotalGain, logout, getWatchedAccounts, getOpenOrders } from '../services/myfxbookApi.jsx';
import { mockData } from '../mockData.js';
import { Calendar } from "@/components/ui/calendar";
import { addDays, format, parseISO, isWithinInterval } from "date-fns";

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
  const [useMockData, setUseMockData] = useState(false);
  const [totalBalance, setTotalBalance] = useState(0);
  const [todayGain, setTodayGain] = useState(0);

  const [dateRange, setDateRange] = useState({
    from: addDays(new Date(), -30),
    to: new Date(),
  });

  useEffect(() => {
    if (session) {
      fetchData();
    }
  }, [session, selectedAccount, dateRange]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (email === 'demo@example.com' && password === 'demo123') {
        setUseMockData(true);
        setSession('mock-session');
      } else {
        const sessionId = await login(email, password);
        setSession(sessionId);
        setUseMockData(false);
      }
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      if (!useMockData) {
        await logout(session);
      }
      setSession('');
      setAccounts([]);
      setWatchedAccounts([]);
      setOpenTrades([]);
      setTradeHistory([]);
      setDailyGain([]);
      setTotalGain(0);
      setUseMockData(false);
    } catch (err) {
      setError('Logout failed. Please try again.');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      if (useMockData) {
        setAccounts(mockData.accounts);
        setWatchedAccounts(mockData.watchedAccounts);
        setOpenTrades(mockData.openTrades);
        setTradeHistory(mockData.tradeHistory);
        
        // Filter daily gain data based on the selected date range
        const filteredDailyGain = mockData.dailyGain.filter(item => 
          isWithinInterval(parseISO(item.date), { start: dateRange.from, end: dateRange.to })
        );
        setDailyGain(filteredDailyGain);
        
        // Calculate total gain for the selected period
        const totalGainForPeriod = filteredDailyGain.reduce((sum, item) => sum + item.gain, 0);
        setTotalGain(totalGainForPeriod);

        setOpenOrders(mockData.openOrders);
        setTotalBalance(mockData.accounts.reduce((sum, account) => sum + account.balance, 0));
        setTodayGain(filteredDailyGain[filteredDailyGain.length - 1]?.gain || 0);
      } else {
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
          setTotalBalance(accountsData.reduce((sum, account) => sum + account.balance, 0));
          setTodayGain(dailyGainData[dailyGainData.length - 1].gain);
        }
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
            <CardTitle className="text-sm font-medium">Total Portfolio</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accounts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Gain</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalGain.toFixed(2)}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Gain</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayGain.toFixed(2)}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBalance.toFixed(2)}</div>
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
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Gain</CardTitle>
              </CardHeader>
              <CardContent>
              <div className="flex justify-center items-center space-x-4 mb-4">
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
                <CardTitle>Portfolio List</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Gain</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accounts.map((account) => (
                      <TableRow key={account.id}>
                        <TableCell>{account.name}</TableCell>
                        <TableCell>${account.balance.toFixed(2)}</TableCell>
                        <TableCell>{account.gain.toFixed(2)}%</TableCell>
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
                      <TableCell>{trade.openDate}</TableCell>
                      <TableCell>{trade.closeDate}</TableCell>
                      <TableCell>{trade.symbol}</TableCell>
                      <TableCell>{trade.action}</TableCell>
                      <TableCell>{trade.profit}</TableCell>
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
                      <TableCell>{account.gain}%</TableCell>
                      <TableCell>{account.drawdown}%</TableCell>
                      <TableCell>{account.change}%</TableCell>
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

  return session ? renderDashboard() : renderLoginForm();
};

export default PortfolioPage;