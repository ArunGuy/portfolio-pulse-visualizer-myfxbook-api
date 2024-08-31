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

      // Check response status
      if (response.status !== 200) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      console.log(`Response from ${endpoint}:`, response.data);

      const parsedData = parseXmlResponse(response.data);
      console.log(`Parsed data from ${endpoint}:`, parsedData);

      if (parsedData.error !== '0') {
        throw new Error(`API Error: ${parsedData.message || 'Unknown error'}`);
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

// Login function with improved error handling
export const login = async () => {
  const email = 'arunwichchusin@hotmail.com';
  const password = 'Mas050322566';

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
    if (error.message.includes('Max login attempts reached')) {
      console.error('Max login attempts reached. Please try to login via the website.');
    } else {
      console.error('Login error:', error.message);
    }
    return null;
  }
};


// Fetch my accounts function
export const getMyAccounts = async (session) => {
  if (!session) {
    throw new Error('Session is required');
  }
  console.log('Fetching my accounts with session:', session);
  try {
    const response = await apiCall('get-my-accounts.xml', { session });
    console.log('Response from get-my-accounts.xml:', response);
    if (!response.accounts || !response.accounts.account) {
      throw new Error('No accounts data received from the API');
    }
    return Array.isArray(response.accounts.account) ? response.accounts.account : [response.accounts.account];
  } catch (error) {
    console.error('Error fetching accounts:', error.message);
    return [];
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
    console.log('Response from get-open-trades.xml:', response);
    if (!response.trades || !response.trades.trade) {
      console.log('No open trades found.');
      return []; // Return an empty array if no trades are found
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
    console.log('Response from get-data-daily.xml:', response);
    if (!response.dataDaily || !response.dataDaily.data) {
      console.log('No daily data found.');
      return []; // Return an empty array if no daily data is found
    }
    return Array.isArray(response.dataDaily.data) ? response.dataDaily.data : [response.dataDaily.data];
  } catch (error) {
    console.error('Error fetching daily data:', error.message);
    return [];
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
    console.log('Response from logout.xml:', response);
    const success = response.error === '0';
    if (success) {
      console.log('Logout successful.');
    } else {
      console.error('Logout failed. Error:', response.message || 'Unknown error');
    }
    return success;
  } catch (error) {
    console.error('Logout error:', error.message);
    return false;
  }
};

// Example usage
login().then(session => {
  if (session) {
    console.log('Session ID:', session);
    // Proceed with other API calls using the session ID
  }
});
