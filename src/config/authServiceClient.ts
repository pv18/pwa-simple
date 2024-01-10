import axios from 'axios';

const baseAuth = process.env.REACT_APP_BASE_URL;

export const authServiceClient = axios.create({
  baseURL: baseAuth,
  timeout: 10 * 1000,
});
