import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { loginToMyfxbook, getHistory, getDailyGain, getGain, getWatchedAccounts } from '../services/myfxbookApi';

const PortfolioPage = () => {
  const [session, setSession] = useState(null);
  const [accountId, setAccountId] = useState(null);
  const [timeRange, setTimeRange] = useState('1M');

  const login = async () => {
    try {
      const loginResponse = await loginToMyfxbook('arunwichchusin@hotmail.com', 'Mas050322566');
      if (loginResponse.error === '0') {
        setSession(loginResponse.session);
      } else {
        console.error('Login failed:', loginResponse.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  useEffect(() => {
    login();
  }, []);

  const { data: watchedAccounts, isLoading: isLoadingAccounts, refetch: refetchAccounts } = useQuery({
    queryKey: ['watchedAccounts', session],
    queryFn: () => getWatchedAccounts(session),
    enabled: !!session,
  });

  useEffect(() => {
    if (watchedAccounts && watchedAccounts.accounts && watchedAccounts.accounts.length > 0) {
      setAccountId(watchedAccounts.accounts[0].id);
    }
  }, [watchedAccounts]);

  const getDateRange = () => {
    const end = new Date();
    let start = new Date();
    switch (timeRange) {
      case '1M':
        start.setMonth(end.getMonth() - 1);
        break;
      case '3M':
        start.setMonth(end.getMonth() - 3);
        break;
      case '6M':
        start.setMonth(end.getMonth() - 6);
        break;
      case '1Y':
        start.setFullYear(end.getFullYear() - 1);
        break;
      default:
        start.setMonth(end.getMonth() - 1);
    }
    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0],
    };
  };

  const { data: historyData, isLoading: isLoadingHistory, refetch: refetchHistory } = useQuery({
    queryKey: ['history', session, accountId, timeRange],
    queryFn: () => {
      const { start, end } = getDateRange();
      return getHistory(session, accountId, start, end);
    },
    enabled: !!session && !!accountId,
  });

  const { data: dailyGainData, isLoading: isLoadingDailyGain, refetch: refetchDailyGain } = useQuery({
    queryKey: ['dailyGain', session, accountId, timeRange],
    queryFn: () => {
      const { start, end } = getDateRange();
      return getDailyGain(session, accountId, start, end);
    },
    enabled: !!session && !!accountId,
  });

  const { data: gainData, isLoading: isLoadingGain, refetch: refetchGain } = useQuery({
    queryKey: ['gain', session, accountId, timeRange],
    queryFn: () => {
      const { start, end } = getDateRange();
      return getGain(session, accountId, start, end);
    },
    enabled: !!session && !!accountId,
  });

  const handleRefresh = () => {
    refetchAccounts();
    refetchHistory();
    refetchDailyGain();
    refetchGain();
  };

  if (isLoadingAccounts || isLoadingHistory || isLoadingDailyGain || isLoadingGain) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!watchedAccounts || !historyData || !dailyGainData || !gainData) {
    return <div className="flex justify-center items-center h-screen">No data available</div>;
  }

  const totalPortfolios = watchedAccounts.accounts.length;
  const dailyChange = parseFloat(dailyGainData.dailyGain[dailyGainData.dailyGain.length - 1].value);
  const weeklyChange = parseFloat(gainData.weeklyGain);
  const monthlyChange = parseFloat(gainData.monthlyGain);

  const portfolios = watchedAccounts.accounts.map(account => ({
    name: account.name,
    amount: parseFloat(account.balance),
    change: parseFloat(account.gain),
  }));

  const dailyGainChartData = dailyGainData.dailyGain.map(item => ({
    date: item.date,
    gain: parseFloat(item.value),
  }));

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Investment Portfolio Overview</h1>
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
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Portfolios</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalPortfolios}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Daily Change</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${dailyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {dailyChange.toFixed(2)}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Weekly Change</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${weeklyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {weeklyChange.toFixed(2)}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Monthly Change</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${monthlyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {monthlyChange.toFixed(2)}%
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="portfolios">Portfolios</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={portfolios}
                      dataKey="amount"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      label
                    />
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Daily Gain</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dailyGainChartData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="gain" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Performance Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={dailyGainChartData}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="gain" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="portfolios">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Listing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Portfolio</th>
                      <th className="text-right p-2">Amount</th>
                      <th className="text-right p-2">Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {portfolios.map((portfolio, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2">{portfolio.name}</td>
                        <td className="text-right p-2">${portfolio.amount.toLocaleString()}</td>
                        <td className={`text-right p-2 ${portfolio.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {portfolio.change.toFixed(2)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PortfolioPage;
