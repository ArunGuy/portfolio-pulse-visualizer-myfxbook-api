import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { loginToMyfxbook, getHistory, getDailyGain, getGain, getWatchedAccounts } from '../services/myfxbookApi';

const PortfolioPage = () => {
  const [session, setSession] = useState(null);
  const [accountId, setAccountId] = useState(null);

  useEffect(() => {
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
    login();
  }, []);

  const { data: watchedAccounts, isLoading: isLoadingAccounts } = useQuery({
    queryKey: ['watchedAccounts', session],
    queryFn: () => getWatchedAccounts(session),
    enabled: !!session,
  });

  useEffect(() => {
    if (watchedAccounts && watchedAccounts.accounts && watchedAccounts.accounts.length > 0) {
      setAccountId(watchedAccounts.accounts[0].id);
    }
  }, [watchedAccounts]);

  const { data: historyData, isLoading: isLoadingHistory } = useQuery({
    queryKey: ['history', session, accountId],
    queryFn: () => getHistory(session, accountId),
    enabled: !!session && !!accountId,
  });

  const { data: dailyGainData, isLoading: isLoadingDailyGain } = useQuery({
    queryKey: ['dailyGain', session, accountId],
    queryFn: () => getDailyGain(session, accountId, '2023-01-01', '2024-03-15'),
    enabled: !!session && !!accountId,
  });

  const { data: gainData, isLoading: isLoadingGain } = useQuery({
    queryKey: ['gain', session, accountId],
    queryFn: () => getGain(session, accountId, '2023-01-01', '2024-03-15'),
    enabled: !!session && !!accountId,
  });

  if (isLoadingAccounts || isLoadingHistory || isLoadingDailyGain || isLoadingGain) {
    return <div>Loading...</div>;
  }

  if (!watchedAccounts || !historyData || !dailyGainData || !gainData) {
    return <div>No data available</div>;
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
      <h1 className="text-3xl font-bold mb-6">Investment Portfolio Overview</h1>
      
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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
    </div>
  );
};

export default PortfolioPage;
