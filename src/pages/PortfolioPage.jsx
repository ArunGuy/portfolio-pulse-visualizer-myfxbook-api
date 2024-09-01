import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RefreshCw, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getMyAccounts, getOpenTrades, getDataDaily, getAccountHistory, getDailyGain, getTotalGain, logout } from '../services/myfxbookApi.jsx';

const PortfolioPage = () => {
  const [timeRange, setTimeRange] = useState('1M');
  const [accounts, setAccounts] = useState([]);
  const [openTrades, setOpenTrades] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [accountHistory, setAccountHistory] = useState([]);
  const [dailyGain, setDailyGain] = useState([]);
  const [totalGain, setTotalGain] = useState(0);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [session, setSession] = useState(null);

  useEffect(() => {
    setSession("dummy-session");
  }, []);

  useEffect(() => {
    if (session) {
      fetchData();
    }
  }, [session, timeRange, selectedAccount]);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const accountsData = await getMyAccounts(session);
      setAccounts(accountsData);
      
      if (accountsData.length > 0) {
        const defaultAccount = selectedAccount || accountsData[0]['@_id'];
        setSelectedAccount(defaultAccount);

        const [openTradesData, dailyDataResult, accountHistoryData, dailyGainData, totalGainResult] = await Promise.all([
          getOpenTrades(session, defaultAccount),
          getDataDaily(session, defaultAccount, getStartDate(), new Date().toISOString()),
          getAccountHistory(session, defaultAccount),
          getDailyGain(session, defaultAccount, getStartDate(), new Date().toISOString()),
          getTotalGain(session, defaultAccount, getStartDate(), new Date().toISOString())
        ]);

        setOpenTrades(openTradesData);
        setDailyData(dailyDataResult);
        setAccountHistory(accountHistoryData);
        setDailyGain(dailyGainData);
        setTotalGain(totalGainResult);
      }
    } catch (err) {
      setError(err.message || 'Unable to fetch data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleRefresh = () => fetchData();

  const handleLogout = async () => {
    try {
      await logout(session);
      setSession(null);
    } catch (err) {
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

  const selectedAccountData = accounts.find(account => account['@_id'] === selectedAccount) || {};

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
                  <TableCell>{trade.profit}</TableCell>
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
                  <TableCell>{history.profit}</TableCell>
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
                    <Pie data={accountHistory} dataKey="profit" nameKey="symbol" cx="50%" cy="50%" outerRadius={80} fill="#8884d8">
                      {accountHistory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#82ca9d' : '#8884d8'} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PortfolioPage;
