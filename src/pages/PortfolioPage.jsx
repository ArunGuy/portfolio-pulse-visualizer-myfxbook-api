import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RefreshCw, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { mockMyAccounts, mockOpenTrades, mockDataDaily } from '../services/myfxbookApi';

const PortfolioPage = () => {
  const [timeRange, setTimeRange] = useState('1M');
  const [accounts, setAccounts] = useState(mockMyAccounts.accounts);
  const [openTrades, setOpenTrades] = useState(mockOpenTrades.trades);
  const [dailyData, setDailyData] = useState(mockDataDaily.dailyData);

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const totalEquity = accounts.reduce((sum, account) => sum + account.equity, 0);
  const totalGain = ((totalEquity - totalBalance) / totalBalance * 100).toFixed(2);

  const handleRefresh = () => {
    console.log("Refreshing data...");
    // In a real app, this would trigger API calls to fetch fresh data
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Forex Portfolio Overview</h1>
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
            <CardTitle>Total Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${totalBalance.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Equity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${totalEquity.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Gain</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold flex items-center ${parseFloat(totalGain) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalGain}%
              {parseFloat(totalGain) >= 0 ? <ArrowUpRight className="ml-2" /> : <ArrowDownRight className="ml-2" />}
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

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="trades">Open Trades</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={accounts}
                      dataKey="balance"
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
                  <LineChart data={dailyData}>
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
        <TabsContent value="accounts">
          <Card>
            <CardHeader>
              <CardTitle>Account Listing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Account Name</th>
                      <th className="text-right p-2">Balance</th>
                      <th className="text-right p-2">Equity</th>
                      <th className="text-right p-2">Gain</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accounts.map((account, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2">{account.name}</td>
                        <td className="text-right p-2">${account.balance.toLocaleString()}</td>
                        <td className="text-right p-2">${account.equity.toLocaleString()}</td>
                        <td className={`text-right p-2 ${account.gain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {account.gain.toFixed(2)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="trades">
          <Card>
            <CardHeader>
              <CardTitle>Open Trades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Ticket</th>
                      <th className="text-left p-2">Symbol</th>
                      <th className="text-left p-2">Type</th>
                      <th className="text-right p-2">Lots</th>
                      <th className="text-right p-2">Open Price</th>
                      <th className="text-right p-2">Current Price</th>
                      <th className="text-right p-2">Profit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {openTrades.map((trade, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2">{trade.ticket}</td>
                        <td className="p-2">{trade.symbol}</td>
                        <td className="p-2">{trade.type}</td>
                        <td className="text-right p-2">{trade.lots}</td>
                        <td className="text-right p-2">{trade.openPrice}</td>
                        <td className="text-right p-2">{trade.currentPrice}</td>
                        <td className={`text-right p-2 ${trade.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${trade.profit.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Performance Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={dailyData}>
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="balance" stroke="#8884d8" />
                  <Line yAxisId="left" type="monotone" dataKey="equity" stroke="#82ca9d" />
                  <Line yAxisId="right" type="monotone" dataKey="gain" stroke="#ffc658" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PortfolioPage;
