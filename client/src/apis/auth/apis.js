import axios from 'axios';

const baseURL = 'http://localhost:5000/api/v1';

export const customAxios = axios.create({ baseURL });


const requestRefreshToken = async () => {
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
                await requestRefreshToken();
                return customAxios(originalRequest);
            } catch (refreshError) {
                await customAxios.post('/auth/logout', {}, { withCredentials: true });
                window.location.href = '/login'
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