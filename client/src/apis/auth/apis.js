import axios from 'axios';
import { API_BASE_URL } from '../../config';

const baseURL = API_BASE_URL;

export const customAxios = axios.create({ baseURL });


const requestRefreshToken = async () => {
    return axios.post(`${baseURL}/auth/refresh-token`, {}, { withCredentials: true });
};

customAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error?.config;
        const status = error?.response?.status;

        // Don't intercept auth endpoints — they handle their own errors
        const url = originalRequest?.url || '';
        if (url.includes('/auth/')) {
            return Promise.reject(error);
        }

        if ((status === 401 || status === 403) && originalRequest && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                await requestRefreshToken();
                return customAxios(originalRequest);
            } catch (refreshError) {
                // Don't redirect here — let ProtectedRoute handle it
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    },
);

export const loginRequest = async ({ email, password }) => {
    const response = await customAxios.post(
        '/auth/login',
        { email, password },
        { withCredentials: true },
    );

    return response.data;
};

export const signupRequest = async ({ username, email, password }) => {
    const response = await customAxios.post(
        '/auth/signup',
        { username, email, password },
        { withCredentials: true },
    );

    return response.data;
};

export const logoutRequest = async () => {
    const response = await customAxios.post('/auth/logout', {}, { withCredentials: true });
    return response.data;
};

export const meRequest = async () => {
    const response = await customAxios.get('/auth/me', { withCredentials: true });
    return response.data;
};

export const verifyUserRequest = async (token) => {
    const response = await customAxios.post(`/auth/verify/${token}`, {}, { withCredentials: true });
    return response.data;
};

export const refreshTokenRequest = async () => {
    const response = await customAxios.post('/auth/refresh-token', {}, { withCredentials: true });
    return response.data;
};