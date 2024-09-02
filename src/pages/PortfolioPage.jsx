import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { RefreshCw, ArrowUpRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { login, getMyAccounts, getDailyGain, getTotalGain, logout, getWatchedAccounts } from '../services/myfxbookApi.jsx';
import { mockData } from '../mockData.js';
import CompoundInterestCalculator from '../components/CompoundInterestCalculator';

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

  useEffect(() => {
    if (session) {
      fetchData();
    }
  }, [session]);

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
        setTotalGain(mockData.totalGain);
        setTotalBalance(mockData.accounts.reduce((sum, account) => sum + account.balance, 0));
      } else {
        const [accountsData, watchedAccountsData, totalGainData] = await Promise.all([
          getMyAccounts(session),
          getWatchedAccounts(session),
          getTotalGain(session)
        ]);
        setAccounts(accountsData);
        setWatchedAccounts(watchedAccountsData);
        setTotalGain(totalGainData);
        setTotalBalance(accountsData.reduce((sum, account) => sum + account.balance, 0));
      }
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderLoginForm = () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-96 bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100">Login to MyFXBook</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
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
    <div className="container mx-auto p-4 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">MyFXBook Portfolio</h1>
        <div className="flex items-center space-x-4">
          <Button onClick={fetchData} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh
          </Button>
          <Button onClick={handleLogout} variant="outline" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">Logout</Button>
          <span className="text-sm">{email}</span>
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
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Portfolio</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accounts.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Gain</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalGain.toFixed(2)}%</div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBalance.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle>Portfolio Gain Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={accounts}>
                <XAxis dataKey="name" stroke="#888888" />
                <YAxis stroke="#888888" />
                <Tooltip />
                <Legend />
                {accounts.map((account, index) => (
                  <Line
                    key={account.id}
                    type="monotone"
                    dataKey="gain"
                    data={[account]}
                    name={account.name}
                    stroke={`hsl(${index * 360 / accounts.length}, 70%, 50%)`}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-800">
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
        <Card className="bg-white dark:bg-gray-800">
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
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle>Compound Interest Calculator</CardTitle>
          </CardHeader>
          <CardContent>
            <CompoundInterestCalculator />
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return session ? renderDashboard() : renderLoginForm();
};

export default PortfolioPage;