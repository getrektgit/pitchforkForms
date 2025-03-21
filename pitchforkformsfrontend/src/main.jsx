import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios'

axios.defaults.baseURL='http://localhost:3000'

let isRefreshing=false
let failedRequestsQueue=[]

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config; //eredeti kérés kivétele (útvonal body stb...)
    if (error.response?.status === 401 && !originalRequest._retry) {
      //401--unauthorized valószinűleg lejárt a tokenünk, és még nem frissitettünk (nem küldtük el újra a kérést)
      originalRequest._retry = true;
      
      if (!isRefreshing) {
        //ha van folyamatban frissités, akkor ne induljon el egy másik, hanem rakja be várakozni
        isRefreshing = true; //folyamat "lezárása" hogy csak 1 frissités legyen egyszerre
        try {

          const response = await axios.post('/auth/refresh', {}, {
            withCredentials: true // Important for sending the httpOnly refresh token cookie
          });
          
          const { accessToken } = response.data;
          localStorage.setItem('accessToken', accessToken);

          failedRequestsQueue.forEach(promise => promise.resolve(accessToken));
          failedRequestsQueue = [];
          
          //szerkesztjük a lementett eredeti kérést, hogy az új tokent használja a headerben
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
          return axios(originalRequest);
        } catch (refreshError) {

          failedRequestsQueue.forEach(promise => promise.reject(refreshError));
          failedRequestsQueue = [];

          localStorage.removeItem('accessToken');
          window.location.href = '/login';
          
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
  (config)=>{
    const token=localStorage.getItem('accessToken')
    if (token)
    {
      config.headers['Authorization']=`Bearer ${token}`
    }
    return config //kicsit olyan mint a next a middlewareben
  },
  (error)=>Promise.reject(error)
)
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
