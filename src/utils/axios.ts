import axios from "axios";
import { serverApiBaseUrl } from "./config";
export default axios.create({
  baseURL: serverApiBaseUrl,
  headers: { "Content-Type": "application/json" },
});
export const axiosAuth = axios.create({
  baseURL: serverApiBaseUrl,
  headers: { "Content-Type": "application/json" },
});
