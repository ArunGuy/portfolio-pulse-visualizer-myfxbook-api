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
        throw new Error(`API Error: ${parsedData.message}`);
      }

      return parsedData;
    } catch (error) {
      console.error(`${endpoint} error (attempt ${retries + 1}):`, error.message);
      retries++;
      if (retries === maxRetries) {
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, 1000 * retries)); // Exponential backoff
    }
  }
};

export const getMyAccounts = async (session) => {
  const response = await apiCall('get-my-accounts.xml', { session });
  return response.accounts.account;
};

export const getOpenTrades = async (session, id) => {
  const response = await apiCall('get-open-trades.xml', { session, id });
  return response.trades.trade;
};

export const getDataDaily = async (session, id, start, end) => {
  const response = await apiCall('get-data-daily.xml', { session, id, start, end });
  return response.dataDaily.data;
};

export const logout = async (session) => {
  const response = await apiCall('logout.xml', { session });
  return response.error === '0';
};
