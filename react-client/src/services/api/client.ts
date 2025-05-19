import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { extractErrorMessage } from '../../utils/apiErrorUtils';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:7051/api',
  headers: {
    'Content-Type': 'application/json',
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response) {
      console.error('Server error:', error.response.status, extractErrorMessage(error));
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Request error:', error.message);
    }

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export const apiService = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    api.get<T>(url, config)
      .then(response => response.data)
      .catch(error => {
        throw new Error(extractErrorMessage(error));
      }),

  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    api.post<T>(url, data, config)
      .then(response => response.data)
      .catch(error => {
        throw new Error(extractErrorMessage(error));
      }),

  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    api.put<T>(url, data, config).then(response => response.data).catch(error => {
      throw new Error(extractErrorMessage(error));
    }),

  patch: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    api.patch<T>(url, data, config).then(response => response.data).catch(error => {
      throw new Error(extractErrorMessage(error));
    }),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    api.delete<T>(url, config).then(response => response.data).catch(error => {
      throw new Error(extractErrorMessage(error));
    }),
};

export default api;