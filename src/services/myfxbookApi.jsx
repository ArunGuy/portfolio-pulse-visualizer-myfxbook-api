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

const apiCall = async (endpoint, params, retries = 3) => {
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
    if (retries > 0) {
      console.log(`Retrying ${endpoint}... (${retries} attempts left)`);
      return apiCall(endpoint, params, retries - 1);
    }
    throw error;
  }
};

const clearSession = () => {
  localStorage.removeItem('sessionId');
};

export const login = async (email, password) => {
  try {
    const response = await apiCall('login.xml', { email, password });
    if (!response.session) {
      throw new Error('Login failed. No session returned.');
    }
    localStorage.setItem('sessionId', response.session); // Store session ID
    return response.session;
  } catch (error) {
    console.error('Login error:', error.message);
    throw error;
  }
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

export const getTotalGain = async (session, id) => {
  if (!session || !id) {
    throw new Error('Session and account ID are required for getTotalGain');
  }
  try {
    const response = await apiCall('get-gain.xml', { session, id });
    return response.value ? parseFloat(response.value) : 0;
  } catch (error) {
    console.error('Error in getTotalGain:', error.message);
    return 0; // Return 0 if there's an error, to avoid breaking the UI
  }
};

export const logout = async () => {
  const session = localStorage.getItem('sessionId');
  if (!session) {
    console.warn('No session found for logout');
    clearSession();
    return true; // หรือ handle ตามที่เหมาะสม
  }
  
  try {
    const response = await apiCall('logout.xml', { session });
    if (response["@_error"] === "true") {
      console.error(`Error during logout: ${response["@_message"]}`);
      // ตรวจสอบว่าถ้าเซสชันหมดอายุหรือไม่
      if (response["@_message"].includes("Invalid session")) {
        clearSession(); // ล้างเซสชันที่หมดอายุ
      }
    } else {
      clearSession(); // Clear session ID from local storage
      return true;
    }
  } catch (error) {
    console.error('Error in logout:', error.message);
  }
  
  return false;
};
