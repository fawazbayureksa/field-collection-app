import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { LOGOUT } from '../constants/mainRouteName';
import { API_URL, Origin } from '@env';
import { navigate } from '../navigations/RootNavigations';

let headers = { 'Content-type': 'multipart/form-data', Origin: Origin };

const Upload = axios.create({
    baseURL: 'https://51a9-158-140-180-1.ngrok-free.app/api/',
    headers,
});

Upload.interceptors.request.use(
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

Upload.interceptors.response.use(
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
            error.response.status === 403 ||
            (error.response.status === 401 &&
                error.response.data.error.message ===
                'commonauth.VerifyTokenMiddleware: token verification failed')
        ) {
            navigate(LOGOUT);
        } else {
            return new Promise((resolve, reject) => {
                reject(error);
            });
        }
    },
);

export default Upload;
