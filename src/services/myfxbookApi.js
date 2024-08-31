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

const apiCall = async (endpoint, params) => {
  const maxRetries = 3;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const response = await axios.get(`${BASE_URL}/${endpoint}`, { params });
      const parsedData = await parseXmlResponse(response.data);

      if (parsedData.response.error[0] !== '0') {
        throw new Error(`API Error: ${parsedData.response.message[0]}`);
      }

      return parsedData.response;
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
  return response.accounts[0].account;
};

export const getOpenTrades = async (session, id) => {
  const response = await apiCall('get-open-trades.xml', { session, id });
  return response.trades[0].trade;
};

export const getDataDaily = async (session, id, start, end) => {
  const response = await apiCall('get-data-daily.xml', { session, id, start, end });
  return response.dataDaily[0].data;
};

export const logout = async (session) => {
  const response = await apiCall('logout.xml', { session });
  return response.error[0] === '0';
};
