import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Cell } from 'recharts';
import { RefreshCw, ArrowUpRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
      if (!useMockData) {
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
        setAccounts(accountsData);
        setTotalBalance(accountsData.reduce((sum, account) => sum + account.balance, 0));
        
        if (accountsData.length > 0) {
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

  // ... (rest of the component code remains the same)

  return (
    <div className="container mx-auto p-4 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* ... (existing JSX) */}
      {accounts.length > 0 && (
        <Select value={selectedAccountId} onValueChange={handleAccountChange}>
          <SelectTrigger className="w-[200px] mb-4">
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
      )}
      {/* ... (rest of the JSX) */}
    </div>
  );
};

export default PortfolioPage;