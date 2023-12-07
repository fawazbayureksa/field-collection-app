import axios from 'axios';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';


const axiosInstance = axios.create({
  baseURL: API_URL, // Replace with your API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});



// Interceptors to add a token to the request header if available
axiosInstance.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  response =>
    new Promise((resolve, reject) => {
      resolve(response);
    }),
  error => {
    if (!error.response) {
      return new Promise((resolve, reject) => {
        reject(error);
      });
    }

    if (
      error?.response?.status === 403 ||
      (error?.response?.status === 401 &&
        error?.response?.data?.error?.message ===
        'commonauth.VerifyTokenMiddleware: token verification failed')
    ) {
      // navigate(LOGOUT);
      console.log('LOGOUT', error);
    } else {
      return new Promise((resolve, reject) => {
        reject(error);
      });
    }
  },
);

export default axiosInstance;
