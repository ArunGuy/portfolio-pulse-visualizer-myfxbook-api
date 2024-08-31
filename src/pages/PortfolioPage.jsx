import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';

// Mock data
const mockPortfolios = [
  { name: "Stock Portfolio", amount: 50000, change: 2.5 },
  { name: "Bond Portfolio", amount: 30000, change: 1.2 },
  { name: "Real Estate", amount: 100000, change: 3.8 },
  { name: "Cryptocurrency", amount: 20000, change: -5.2 },
];

const mockDailyGainData = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(2023, 0, i + 1).toISOString().split('T')[0],
  gain: Math.random() * 4 - 2, // Random value between -2 and 2
}));

const PortfolioPage = () => {
  const [timeRange, setTimeRange] = useState('1M');

  const totalPortfolios = mockPortfolios.length;
  const dailyChange = mockDailyGainData[mockDailyGainData.length - 1].gain;
  const weeklyChange = mockDailyGainData.slice(-7).reduce((acc, curr) => acc + curr.gain, 0);
  const monthlyChange = mockDailyGainData.reduce((acc, curr) => acc + curr.gain, 0);

  const handleRefresh = () => {
    console.log("Refreshing data...");
    // In a real app, this would trigger data refetch
  };

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
                      data={mockPortfolios}
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
                  <LineChart data={mockDailyGainData}>
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
                <LineChart data={mockDailyGainData}>
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
                    {mockPortfolios.map((portfolio, index) => (
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
