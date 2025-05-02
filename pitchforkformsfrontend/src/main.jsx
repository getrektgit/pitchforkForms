import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:3000'

let isRefreshing = false
let failedRequestsQueue = []

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // If the error is due to invalid credentials, don't attempt token refresh
      if (error.response?.data?.message === "Hibás email vagy jelszó!") {
        return Promise.reject(error); // Do not attempt to refresh token, reject the promise
      }

      // Handle refresh token logic for expired token
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const response = await axios.post('/auth/refresh', {}, {
            withCredentials: true,
          });

          const { accessToken } = response.data;
          localStorage.setItem('accessToken', accessToken);

          failedRequestsQueue.forEach(promise => promise.resolve(accessToken));
          failedRequestsQueue = [];

          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
          return axios(originalRequest);
        } catch (refreshError) {
          failedRequestsQueue.forEach(promise => promise.reject(refreshError));
          failedRequestsQueue = [];

          localStorage.removeItem('accessToken');
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({
            resolve: (token) => {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
              resolve(axios(originalRequest));
            },
            reject: (error) => {
              reject(error);
            }
          });
        });
      }
    }

    return Promise.reject(error);
  }
);


//minden kéréshez hozzáadja a tokenünket a headerbe
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config //kicsit olyan mint a next a middlewareben
  },
  (error) => Promise.reject(error)
)
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
