import { customAxios } from "../auth/apis";

export const getAllUsersAdminRequest = async () => {
    const response = await customAxios.get("/admin", { withCredentials: true });
    return response.data;
};

export const getUserByIdAdminRequest = async (id) => {
    const response = await customAxios.get(`/admin/${id}`, { withCredentials: true });
    return response.data;
};

export const updateUserByIdAdminRequest = async (id, payload) => {
    const response = await customAxios.patch(`/admin/${id}`, payload, {
        withCredentials: true,
    });
    return response.data;
};

export const deleteUserByIdAdminRequest = async (id) => {
    const response = await customAxios.delete(`/admin/${id}`, { withCredentials: true });
    return response.data;
};
