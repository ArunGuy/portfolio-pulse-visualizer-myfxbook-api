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
  try {
    const response = await axios.get(`${BASE_URL}/${endpoint}`, { params });
    if (response.status !== 200) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    const parsedData = parseXmlResponse(response.data);
    if (parsedData["@_error"] === "true") {
      throw new Error(`API Error: ${parsedData["@_message"] || 'Unknown error'}`);
    }
    return parsedData;
  } catch (error) {
    console.error(`Error in ${endpoint}:`, error.message);
    throw error;
  }
};

export const login = async (email, password) => {
  const response = await apiCall('login.xml', { email, password });
  return response.session;
};

export const getMyAccounts = async (session) => {
  const response = await apiCall('get-my-accounts.xml', { session });
  return response.accounts.account;
};

export const getWatchedAccounts = async (session) => {
  const response = await apiCall('get-watched-accounts.xml', { session });
  return response.accounts.account;
};

export const getOpenOrders = async (session, id) => {
  const response = await apiCall('get-open-orders.xml', { session, id });
  return response.openOrders ? response.openOrders.order : [];
};

export const getOpenTrades = async (session, id) => {
  const response = await apiCall('get-open-trades.xml', { session, id });
  return response.opentrades ? response.opentrades.trade : [];
};

export const getAccountHistory = async (session, id) => {
  const response = await apiCall('get-history.xml', { session, id });
  return response.history ? response.history.transaction : [];
};

export const getDailyGain = async (session, id, start, end) => {
  const response = await apiCall('get-daily-gain.xml', { session, id, start, end });
  return response.dailyGain ? response.dailyGain.gain : [];
};

export const getTotalGain = async (session, id, start, end) => {
  const response = await apiCall('get-gain.xml', { session, id, start, end });
  return response.value;
};

export const logout = async (session) => {
  await apiCall('logout.xml', { session });
  return true;
};