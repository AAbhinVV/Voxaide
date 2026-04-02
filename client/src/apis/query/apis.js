import { customAxios } from "../auth/apis";

export const askQueryRequest = async (question) => {
    const response = await customAxios.post(
        "/query",
        { question },
        { withCredentials: true },
    );
    return response.data;
};
