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

export const getMyAccounts = async (session) => {
  try {
    const response = await axios.get(`${BASE_URL}/get-my-accounts.xml`, {
      params: { session }
    });
    const parsedData = await parseXmlResponse(response.data);
    return parsedData.response.accounts[0].account;
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
    return parsedData.response.trades[0].trade;
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
    return parsedData.response.dataDaily[0].data;
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
    return parsedData.response.error[0] === '0';
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};
