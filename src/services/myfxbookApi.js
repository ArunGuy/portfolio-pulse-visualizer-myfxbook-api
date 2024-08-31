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
  const response = await axios.get(`${BASE_URL}/login.xml`, {
    params: { email, password }
  });
  const parsedData = await parseXmlResponse(response.data);
  return parsedData.response;
};

export const getHistory = async (session, id) => {
  const response = await axios.get(`${BASE_URL}/get-history.xml`, {
    params: { session, id }
  });
  const parsedData = await parseXmlResponse(response.data);
  return parsedData.response;
};

export const getDailyGain = async (session, id, start, end) => {
  const response = await axios.get(`${BASE_URL}/get-daily-gain.xml`, {
    params: { session, id, start, end }
  });
  const parsedData = await parseXmlResponse(response.data);
  return parsedData.response;
};

export const getGain = async (session, id, start, end) => {
  const response = await axios.get(`${BASE_URL}/get-gain.xml`, {
    params: { session, id, start, end }
  });
  const parsedData = await parseXmlResponse(response.data);
  return parsedData.response;
};

export const getWatchedAccounts = async (session) => {
  const response = await axios.get(`${BASE_URL}/get-watched-accounts.xml`, {
    params: { session }
  });
  const parsedData = await parseXmlResponse(response.data);
  return parsedData.response;
};