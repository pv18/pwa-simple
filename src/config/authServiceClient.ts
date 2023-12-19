import axios from 'axios';

const baseAuth = 'https://jsonplaceholder.typicode.com';

export const authServiceClient = axios.create({
  baseURL: baseAuth,
  timeout: 10 * 1000,
});
