import axios from 'axios';
import { config } from './config';
import { refreshToken } from '@/features/auth';
import { AUTH_ENDPOINTS } from '@/features/auth';
import { useAuthStore } from '@/store';
import { ROUTES } from '@/app/routes';

export const api = axios.create({
    baseURL: config.apiBaseUrl,
    withCredentials: true,
});


let refreshPromise: Promise<void> | null = null;

export const refreshAccessToken = () => {

    if (!refreshPromise) {
        refreshPromise = refreshToken().then(() => {

            refreshPromise = null;

        }).catch((err) => {

            refreshPromise = null;
            throw err;
        });
    };

    return refreshPromise;
};

api.interceptors.response.use((res) => res, async (error) => {

    const originalRequest = error.config;

    const notAllowedEndpoints = [
        AUTH_ENDPOINTS.login,
        AUTH_ENDPOINTS.refreshToken,
        AUTH_ENDPOINTS.me
    ];

    if (error.response?.status === 401 && !originalRequest._retry && !notAllowedEndpoints.includes(originalRequest.url)) {

        originalRequest._retry = true;

        try {

            await refreshAccessToken();
            return api(originalRequest);

        } catch (refreshError) {

            useAuthStore.getState().clearAuth();

            const currentPath = window.location.pathname;
            const currentParams = window.location.search;
            if (currentPath !== ROUTES.login) {
                window.location.href = `${ROUTES.login}?redirect=${encodeURIComponent(currentPath + currentParams)}`;
            };

            return Promise.reject(refreshError);
        }
    }

    return Promise.reject(error);
});