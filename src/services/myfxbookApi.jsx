import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

const BASE_URL = 'https://www.myfxbook.com/api';

// Initialize XML parser
const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_"
});

// Parse XML response
const parseXmlResponse = (xmlData) => {
  const result = parser.parse(xmlData);
  return result.response;
};

// Generic API call function with retry logic
const apiCall = async (endpoint, params) => {
  const maxRetries = 3;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      console.log(`Making API call to ${endpoint} with params:`, params);
      const response = await axios.get(`${BASE_URL}/${endpoint}`, { params });

      if (response.status !== 200) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      console.log(`Response from ${endpoint}:`, response.data);

      const parsedData = parseXmlResponse(response.data);
      console.log(`Parsed data from ${endpoint}:`, parsedData);

      if (parsedData["@_error"] === "true") {
        throw new Error(`API Error: ${parsedData["@_message"] || 'Unknown error'}`);
      }

      return parsedData;
    } catch (error) {
      console.error(`${endpoint} error (attempt ${retries + 1}):`, error.message);
      retries++;
      if (retries === maxRetries) {
        console.error(`Max retries reached for ${endpoint}.`, error);
        throw error;
      }
      console.log(`Retrying ${endpoint} in ${1000 * retries} ms...`);
      await new Promise(resolve => setTimeout(resolve, 1000 * retries)); // Exponential backoff
    }
  }
};

// Login function
export const login = async (email, password) => {
  console.log('Attempting to login with email:', email);
  try {
    const response = await apiCall('login.xml', { email, password });
    if (response.session) {
      console.log('Login successful. Session ID:', response.session);
      return response.session;
    } else {
      console.error('Login failed. No session ID received.');
      return null;
    }
  } catch (error) {
    console.error('Login error:', error.message);
    throw error;
  }
};

// Validate session function
export const validateSession = async (session) => {
  if (!session) {
    return false;
  }
  try {
    await apiCall('get-my-accounts.xml', { session });
    return true;
  } catch (error) {
    console.error('Session validation failed:', error.message);
    return false;
  }
};

// Fetch my accounts function
export const getMyAccounts = async (session) => {
  if (!session) {
    throw new Error('Session is required');
  }
  console.log('Fetching my accounts with session:', session);
  try {
    const isValidSession = await validateSession(session);
    if (!isValidSession) {
      throw new Error('Invalid session');
    }
    const response = await apiCall('get-my-accounts.xml', { session });
    if (!response.accounts || !response.accounts.account) {
      throw new Error('No accounts data received from the API');
    }
    return Array.isArray(response.accounts.account) ? response.accounts.account : [response.accounts.account];
  } catch (error) {
    console.error('Error fetching accounts:', error.message);
    throw error;
  }
};

// Fetch open trades function
export const getOpenTrades = async (session, id) => {
  if (!session || !id) {
    throw new Error('Session and account ID are required');
  }
  console.log('Fetching open trades with session:', session, 'and account ID:', id);
  try {
    const response = await apiCall('get-open-trades.xml', { session, id });
    if (!response.trades || !response.trades.trade) {
      console.log('No open trades found.');
      return [];
    }
    return Array.isArray(response.trades.trade) ? response.trades.trade : [response.trades.trade];
  } catch (error) {
    console.error('Error fetching open trades:', error.message);
    return [];
  }
};

// Fetch daily data function
export const getDataDaily = async (session, id, start, end) => {
  if (!session || !id || !start || !end) {
    throw new Error('Session, account ID, start date, and end date are required');
  }
  console.log('Fetching daily data with session:', session, 'account ID:', id, 'start date:', start, 'end date:', end);
  try {
    const response = await apiCall('get-data-daily.xml', { session, id, start, end });
    if (!response.dataDaily || !response.dataDaily.data) {
      console.log('No daily data found.');
      return [];
    }
    return Array.isArray(response.dataDaily.data) ? response.dataDaily.data : [response.dataDaily.data];
  } catch (error) {
    console.error('Error fetching daily data:', error.message);
    return [];
  }
};

// Fetch watched accounts function
export const getWatchedAccounts = async (session) => {
  if (!session) {
    throw new Error('Session is required');
  }
  console.log('Fetching watched accounts with session:', session);
  try {
    const response = await apiCall('get-watched-accounts.xml', { session });
    if (!response.accounts || !response.accounts.account) {
      throw new Error('No watched accounts data received from the API');
    }
    return Array.isArray(response.accounts.account) ? response.accounts.account : [response.accounts.account];
  } catch (error) {
    console.error('Error fetching watched accounts:', error.message);
    return [];
  }
};

// Fetch account history function
export const getAccountHistory = async (session, id) => {
  if (!session || !id) {
    throw new Error('Session and account ID are required');
  }
  console.log('Fetching account history with session:', session, 'and account ID:', id);
  try {
    const response = await apiCall('get-history.xml', { session, id });
    if (!response.history || !response.history.transaction) {
      console.log('No account history found.');
      return [];
    }
    return Array.isArray(response.history.transaction) ? response.history.transaction : [response.history.transaction];
  } catch (error) {
    console.error('Error fetching account history:', error.message);
    return [];
  }
};

// Fetch daily gain function
export const getDailyGain = async (session, id, start, end) => {
  if (!session || !id || !start || !end) {
    throw new Error('Session, account ID, start date, and end date are required');
  }
  console.log('Fetching daily gain with session:', session, 'account ID:', id, 'start date:', start, 'end date:', end);
  try {
    const response = await apiCall('get-daily-gain.xml', { session, id, start, end });
    if (!response.dailyGain || !response.dailyGain.gain) {
      console.log('No daily gain data found.');
      return [];
    }
    return Array.isArray(response.dailyGain.gain) ? response.dailyGain.gain : [response.dailyGain.gain];
  } catch (error) {
    console.error('Error fetching daily gain:', error.message);
    return [];
  }
};

// Fetch total gain function
export const getTotalGain = async (session, id, start, end) => {
  if (!session || !id || !start || !end) {
    throw new Error('Session, account ID, start date, and end date are required');
  }
  console.log('Fetching total gain with session:', session, 'account ID:', id, 'start date:', start, 'end date:', end);
  try {
    const response = await apiCall('get-gain.xml', { session, id, start, end });
    return response.value || 0;
  } catch (error) {
    console.error('Error fetching total gain:', error.message);
    return 0;
  }
};

// Logout function
export const logout = async (session) => {
  if (!session) {
    throw new Error('Session is required');
  }
  console.log('Logging out with session:', session);
  try {
    const response = await apiCall('logout.xml', { session });
    const success = response["@_error"] === "0";
    if (success) {
      console.log('Logout successful.');
    } else {
      console.error('Logout failed. Error:', response["@_message"] || 'Unknown error');
    }
    return success;
  } catch (error) {
    console.error('Logout error:', error.message);
    throw error;
  }
};

// Fetch open orders function
export const getOpenOrders = async (session, id) => {
  if (!session || !id) {
    throw new Error('Session and account ID are required');
  }
  console.log('Fetching open orders with session:', session, 'and account ID:', id);
  try {
    const response = await apiCall('get-open-orders.xml', { session, id });
    if (!response.orders || !response.orders.order) {
      console.log('No open orders found.');
      return [];
    }
    return Array.isArray(response.orders.order) ? response.orders.order : [response.orders.order];
  } catch (error) {
    console.error('Error fetching open orders:', error.message);
    return [];
  }
};