import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';

// Mock API function (replace with actual API call)
const fetchPortfolioData = async () => {
  // Simulated API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    totalPortfolios: 5,
    dailyChange: 2.5,
    weeklyChange: -1.2,
    monthlyChange: 5.8,
    portfolios: [
      { name: 'Tech Stocks', amount: 50000, change: 3.2 },
      { name: 'Real Estate', amount: 75000, change: -0.8 },
      { name: 'Bonds', amount: 30000, change: 0.5 },
      { name: 'Cryptocurrencies', amount: 10000, change: 7.5 },
      { name: 'Commodities', amount: 15000, change: 1.2 },
    ],
  };
};

const PortfolioPage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['portfolioData'],
    queryFn: fetchPortfolioData,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const { totalPortfolios, dailyChange, weeklyChange, monthlyChange, portfolios } = data;

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
            <CardTitle>Portfolio Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={portfolios}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="change" fill="#82ca9d" />
              </BarChart>
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