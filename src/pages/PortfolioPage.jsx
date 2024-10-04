import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Cell } from 'recharts';
import { RefreshCw, AlertCircle, BarChart2, LineChart as LineChartIcon, PieChart as PieChartIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login, getMyAccounts, getWatchedAccounts, logout } from '../services/myfxbookApi.jsx';
import { mockData } from '../mockData.js';

const PortfolioPage = () => {
  const [session, setSession] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [watchedAccounts, setWatchedAccounts] = useState([]);
  const [totalGain, setTotalGain] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [useMockData, setUseMockData] = useState(false);
  const [chartType, setChartType] = useState('bar');

  useEffect(() => {
    const storedSession = localStorage.getItem('sessionId');
    if (storedSession) {
      setSession(storedSession);
      validateSession(storedSession);
    }
  }, []);

  const validateSession = async (sessionId) => {
    try {
      const response = await fetch('/api/validate-session', { headers: { 'Authorization': `Bearer ${sessionId}` } });
      if (response.ok) {
        fetchData(sessionId);
      } else {
        throw new Error('Invalid session');
      }
    } catch (err) {
      handleLogout();
      setError('Session validation failed. Please log in again.');
      console.error('Session validation error:', err);
    }
  };

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
      setTotalBalance(0);
      setUseMockData(false);
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
        const mockTotalGain = mockData.accounts.reduce((sum, account) => sum + account.gain, 0);
        setTotalGain(mockTotalGain);
        const mockTotalBalance = mockData.accounts.reduce((sum, account) => sum + account.balance, 0);
        setTotalBalance(mockTotalBalance);
      } else {
        const accountsData = await getMyAccounts(sessionId);
        if (accountsData && accountsData.length > 0) {
          setAccounts(accountsData);
          const totalGainCalculated = accountsData.reduce((sum, account) => sum + account.gain, 0);
          setTotalGain(totalGainCalculated);
          const totalBalanceCalculated = accountsData.reduce((sum, account) => sum + account.balance, 0);
          setTotalBalance(totalBalanceCalculated);
          
          const watchedAccountsData = await getWatchedAccounts(sessionId);
          setWatchedAccounts(watchedAccountsData);
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

  const getChartData = () => {
    if (!accounts || accounts.length === 0) {
      return [];
    }
    return accounts.map(account => ({
      name: account.name,
      gain: account.gain,
      balance: account.balance
    }));
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

  return (
    <div className="container mx-auto p-4 bg-background text-foreground">
      <h1 className="text-3xl font-bold mb-6">Portfolio Overview</h1>
      
      {!session ? (
        <Card className="max-w-md mx-auto">
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
                  autoComplete="username"
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
                  autoComplete="current-password"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
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
                <p className="text-3xl font-bold">$ {totalBalance.toFixed(2)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total Gain</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">% {totalGain.toFixed(2)}</p>
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
                    <TableHead>Gain</TableHead>
                    <TableHead>Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell>{account.name}</TableCell>
                      <TableCell>{account.gain.toFixed(2)}%</TableCell>
                      <TableCell>${account.balance.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Portfolio Analysis</CardTitle>
              <Select value={chartType} onValueChange={setChartType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select chart type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">
                    <div className="flex items-center">
                      <BarChart2 className="mr-2 h-4 w-4" />
                      <span>Bar Chart</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="line">
                    <div className="flex items-center">
                      <LineChartIcon className="mr-2 h-4 w-4" />
                      <span>Line Chart</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="pie">
                    <div className="flex items-center">
                      <PieChartIcon className="mr-2 h-4 w-4" />
                      <span>Pie Chart</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                {chartType === 'bar' ? (
                  <BarChart data={getChartData()}>
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="gain" fill="#8884d8" name="Gain (%)" />
                    <Bar yAxisId="right" dataKey="balance" fill="#82ca9d" name="Balance ($)" />
                  </BarChart>
                ) : chartType === 'line' ? (
                  <LineChart data={getChartData()}>
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="gain" stroke="#8884d8" name="Gain (%)" />
                    <Line yAxisId="right" type="monotone" dataKey="balance" stroke="#82ca9d" name="Balance ($)" />
                  </LineChart>
                ) : (
                  <PieChart>
                    <Pie
                      data={getChartData()}
                      dataKey="balance"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={150}
                      fill="#8884d8"
                      label
                    >
                      {getChartData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
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
