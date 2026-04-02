import { customAxios } from "../auth/apis";

export const getCurrentUserRequest = async () => {
    const response = await customAxios.get("/users/me", { withCredentials: true });
    return response.data;
};

export const updateCurrentUserRequest = async (payload) => {
    const response = await customAxios.patch("/users/me", payload, { withCredentials: true });
    return response.data;
};

export const deleteCurrentUserRequest = async () => {
    const response = await customAxios.delete("/users/me", { withCredentials: true });
    return response.data;
};
