import axios from 'axios';
import { parseString } from 'xml2js';

const BASE_URL = 'https://www.myfxbook.com/api';

const parseXmlResponse = (xmlData) => {
  return new Promise((resolve, reject) => {
    parseString(xmlData, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

export const loginToMyfxbook = async (email, password) => {
  try {
    const response = await axios.get(`${BASE_URL}/login.xml`, {
      params: { email, password }
    });
    const parsedData = await parseXmlResponse(response.data);
    return parsedData.response;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const getMyAccounts = async (session) => {
  try {
    const response = await axios.get(`${BASE_URL}/get-my-accounts.xml`, {
      params: { session }
    });
    const parsedData = await parseXmlResponse(response.data);
    return parsedData.response;
  } catch (error) {
    console.error('Get my accounts error:', error);
    throw error;
  }
};

export const getOpenTrades = async (session, id) => {
  try {
    const response = await axios.get(`${BASE_URL}/get-open-trades.xml`, {
      params: { session, id }
    });
    const parsedData = await parseXmlResponse(response.data);
    return parsedData.response;
  } catch (error) {
    console.error('Get open trades error:', error);
    throw error;
  }
};

export const getDataDaily = async (session, id, start, end) => {
  try {
    const response = await axios.get(`${BASE_URL}/get-data-daily.xml`, {
      params: { session, id, start, end }
    });
    const parsedData = await parseXmlResponse(response.data);
    return parsedData.response;
  } catch (error) {
    console.error('Get data daily error:', error);
    throw error;
  }
};

export const logout = async (session) => {
  try {
    const response = await axios.get(`${BASE_URL}/logout.xml`, {
      params: { session }
    });
    const parsedData = await parseXmlResponse(response.data);
    return parsedData.response;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

// Mock data for testing
export const mockMyAccounts = {
  accounts: [
    { id: '12345', name: 'Demo Account 1', balance: 10000, equity: 10500, gain: 5.0 },
    { id: '67890', name: 'Demo Account 2', balance: 5000, equity: 4800, gain: -4.0 },
  ]
};

export const mockOpenTrades = {
  trades: [
    { ticket: '1', symbol: 'EURUSD', type: 'Buy', lots: 0.1, openPrice: 1.1000, currentPrice: 1.1050, profit: 50 },
    { ticket: '2', symbol: 'GBPUSD', type: 'Sell', lots: 0.2, openPrice: 1.3000, currentPrice: 1.2950, profit: 100 },
  ]
};

export const mockDataDaily = {
  dailyData: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(2023, 0, i + 1).toISOString().split('T')[0],
    balance: 10000 + Math.random() * 1000,
    equity: 10000 + Math.random() * 1200,
    gain: (Math.random() * 4 - 2).toFixed(2),
  }))
};
