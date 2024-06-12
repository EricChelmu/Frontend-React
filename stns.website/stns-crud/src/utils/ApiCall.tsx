import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { getToken } from "./AuthUtils";

interface FetchOptions {
  method: "GET" | "POST" | "PUT" | "DELETE";
  url: string;
  data?: any;
  headers?: Record<string, string>;
  params?: Record<string, any>;
}

const buildUrlWithParams = (url: string, params: Record<string, any>): string => {
  const queryString = new URLSearchParams(params).toString();
  return `${url}?${queryString}`;
};

const apiCall = async ({
  method,
  url,
  data,
  headers,
  params,
}: FetchOptions): Promise<AxiosResponse<any>> => {
  const token = getToken();
  const defaultHeaders = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (params) {
    url = buildUrlWithParams(url, params);
  }

  const config: AxiosRequestConfig = {
    method,
    url,
    headers: { ...defaultHeaders, ...headers },
    data,
  };

  console.log(`Making ${method} request to ${url}`);
  if (params) {
    console.log(`With params:`, params);
  }
  if (data) {
    console.log(`With data:`, data);
  }

  try {
    const response = await axios(config);
    return response;
  } catch (error) {
    console.error(`Error making ${method} request to ${url}:`, error);
    throw error;
  }
};

export default apiCall;
