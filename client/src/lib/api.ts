import axios from 'axios';
import { config } from './config';

export const api = axios.create({
    baseURL: config.apiBaseUrl,
    withCredentials: true,
});


api.interceptors.response.use((res) => res, async (error) => {

    if (error.response?.status === 401) {
        console.log('Unauthorized');
    };

    return Promise.reject(error);
});