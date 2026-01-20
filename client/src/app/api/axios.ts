import axios from "axios";

const BACKEND_API_URL = 'http://localhost:4200';

export const api = axios.create({
  baseURL: `${BACKEND_API_URL}/api`,
  timeout: 10_000,
});
