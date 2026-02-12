import { IconBrandWindows } from '@tabler/icons-react';
import axios from 'axios';

const baseURL = 'http://localhost:5000/api/v1';

export const customAxios = axios.create({ baseURL });


const refreshTokenRequest = async () => {
    return axios.post(`${baseURL}/auth/refresh-token`, {}, { withCredentials: true });
};

customAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error?.config;
        const status = error?.response?.status;

        if (status === 403 && originalRequest && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                await refreshTokenRequest();
                return customAxios(originalRequest);
            } catch (refreshError) {
                await customAxios.post('/auth/logout', {}, { withCredentials: true });
                window.location.href = '/auth/login'
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
    customAxios.post('/auth/logout', {}, { withCredentials: true });
    
}

export const meRequest = async () => {
    const response = await customAxios.get('/auth/me', { withCredentials: true });
    return response.data;
}