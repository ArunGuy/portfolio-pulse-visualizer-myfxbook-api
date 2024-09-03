import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Cell } from 'recharts';
import { RefreshCw, ArrowUpRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login, getMyAccounts, getDailyGain, getTotalGain, logout, getWatchedAccounts } from '../services/myfxbookApi.jsx';
import { mockData } from '../mockData.js';

const PortfolioPage = () => {
  const [session, setSession] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [watchedAccounts, setWatchedAccounts] = useState([]);
  const [totalGain, setTotalGain] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [useMockData, setUseMockData] = useState(false);
  const [totalBalance, setTotalBalance] = useState(0);
  const [chartType, setChartType] = useState('bar');
  const [selectedAccountId, setSelectedAccountId] = useState('');

  useEffect(() => {
    const storedSession = localStorage.getItem('sessionId');
    if (storedSession) {
      setSession(storedSession);
      fetchData(storedSession);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (email === 'demo@example.com' && password === 'demo123') {
        setUseMockData(true);
        const mockSession = 'mock-session';
        setSession(mockSession);
        localStorage.setItem('sessionId', mockSession);
      } else {
        const sessionId = await login(email, password);
        setSession(sessionId);
        localStorage.setItem('sessionId', sessionId);
        setUseMockData(false);
      }
      await fetchData(session);
    } catch (err) {
      setError('Login failed. Please check your credentials and try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      if (!useMockData && session) {
        await logout(session);
      }
      setSession('');
      setAccounts([]);
      setWatchedAccounts([]);
      setTotalGain(0);
      setUseMockData(false);
      setSelectedAccountId('');
      localStorage.removeItem('sessionId');
    } catch (err) {
      setError('Logout failed. Please try again.');
      console.error('Logout error:', err);
    }
  };

  const fetchData = async (sessionId) => {
    if (!sessionId) {
      setError('No valid session. Please log in.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      if (useMockData) {
        setAccounts(mockData.accounts);
        setWatchedAccounts(mockData.watchedAccounts);
        setTotalGain(mockData.totalGain);
        setTotalBalance(mockData.accounts.reduce((sum, account) => sum + account.balance, 0));
        if (mockData.accounts.length > 0) {
          setSelectedAccountId(mockData.accounts[0].id);
        }
      } else {
        const accountsData = await getMyAccounts(sessionId);
        if (accountsData && accountsData.length > 0) {
          setAccounts(accountsData);
          setTotalBalance(accountsData.reduce((sum, account) => sum + account.balance, 0));
          setSelectedAccountId(accountsData[0].id);
          
          const [watchedAccountsData, totalGainData] = await Promise.all([
            getWatchedAccounts(sessionId),
            getTotalGain(sessionId, accountsData[0].id)
          ]);
          setWatchedAccounts(watchedAccountsData);
          setTotalGain(totalGainData);
        } else {
          setError('No accounts found for this user.');
        }
      }
    } catch (err) {
      setError(`Failed to fetch data: ${err.message}. Please try again later.`);
      console.error('Fetch data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccountChange = async (accountId) => {
    if (!session || !accountId) {
      setError('Invalid session or account. Please try logging in again.');
      return;
    }
    setSelectedAccountId(accountId);
    if (!useMockData) {
      try {
        const totalGainData = await getTotalGain(session, accountId);
        setTotalGain(totalGainData);
      } catch (err) {
        setError(`Failed to fetch total gain for the selected account: ${err.message}`);
        console.error('Fetch total gain error:', err);
      }
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6">Portfolio Overview</h1>
      
      {!session ? (
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <Button onClick={() => fetchData(session)} disabled={loading}>
              <RefreshCw className="mr-2 h-4 w-4" /> Refresh Data
            </Button>
            <Button onClick={handleLogout} variant="outline">Logout</Button>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Total Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">${totalBalance.toFixed(2)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total Gain</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">${totalGain.toFixed(2)}</p>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>My Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Gain</TableHead>
                    <TableHead>Drawdown</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell>{account.name}</TableCell>
                      <TableCell>${account.balance.toFixed(2)}</TableCell>
                      <TableCell>{account.gain.toFixed(2)}%</TableCell>
                      <TableCell>{account.drawdown.toFixed(2)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="mb-6">
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
                      <TableCell>{account.gain.toFixed(2)}%</TableCell>
                      <TableCell>{account.drawdown.toFixed(2)}%</TableCell>
                      <TableCell>{account.change.toFixed(2)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <Select value={selectedAccountId} onValueChange={handleAccountChange}>
                  <SelectTrigger className="w-[180px]">
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
                <Select value={chartType} onValueChange={setChartType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select chart type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bar">Bar Chart</SelectItem>
                    <SelectItem value="line">Line Chart</SelectItem>
                    <SelectItem value="pie">Pie Chart</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                {chartType === 'bar' && (
                  <BarChart data={mockData.dailyGain}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="gain" fill="#8884d8" />
                    <Bar dataKey="profit" fill="#82ca9d" />
                  </BarChart>
                )}
                {chartType === 'line' && (
                  <LineChart data={mockData.dailyGain}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="gain" stroke="#8884d8" />
                    <Line type="monotone" dataKey="profit" stroke="#82ca9d" />
                  </LineChart>
                )}
                {chartType === 'pie' && (
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Gain', value: totalGain },
                        { name: 'Balance', value: totalBalance - totalGain }
                      ]}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      label
                    >
                      <Cell key="cell-0" fill="#8884d8" />
                      <Cell key="cell-1" fill="#82ca9d" />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                )}
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default PortfolioPage;