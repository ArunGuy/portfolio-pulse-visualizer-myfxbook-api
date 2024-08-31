import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

const BASE_URL = 'https://www.myfxbook.com/api';

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_"
});

const parseXmlResponse = (xmlData) => {
  const result = parser.parse(xmlData);
  return result.response;
};

const apiCall = async (endpoint, params) => {
  const maxRetries = 3;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const response = await axios.get(`${BASE_URL}/${endpoint}`, { params });
      const parsedData = parseXmlResponse(response.data);

      if (parsedData.error !== '0') {
        throw new Error(`API Error: ${parsedData.message || 'Unknown error'}`);
      }

      return parsedData;
    } catch (error) {
      console.error(`${endpoint} error (attempt ${retries + 1}):`, error.message);
      console.error('Full error object:', error);
      console.error('Response data:', error.response?.data);
      
      retries++;
      if (retries === maxRetries) {
        if (error.response?.data) {
          const parsedErrorData = parseXmlResponse(error.response.data);
          throw new Error(`API Error: ${parsedErrorData.message || error.message}`);
        } else {
          throw error;
        }
      }
      await new Promise(resolve => setTimeout(resolve, 1000 * retries)); // Exponential backoff
    }
  }
};

export const getMyAccounts = async (session) => {
  const response = await apiCall('get-my-accounts.xml', { session });
  if (!response.accounts || !response.accounts.account) {
    throw new Error('No accounts data received from the API');
  }
  return Array.isArray(response.accounts.account) ? response.accounts.account : [response.accounts.account];
};

export const getOpenTrades = async (session, id) => {
  const response = await apiCall('get-open-trades.xml', { session, id });
  if (!response.trades || !response.trades.trade) {
    return []; // Return an empty array if no trades are found
  }
  return Array.isArray(response.trades.trade) ? response.trades.trade : [response.trades.trade];
};

export const getDataDaily = async (session, id, start, end) => {
  const response = await apiCall('get-data-daily.xml', { session, id, start, end });
  if (!response.dataDaily || !response.dataDaily.data) {
    return []; // Return an empty array if no daily data is found
  }
  return Array.isArray(response.dataDaily.data) ? response.dataDaily.data : [response.dataDaily.data];
};

export const logout = async (session) => {
  const response = await apiCall('logout.xml', { session });
  return response.error === '0';
};
