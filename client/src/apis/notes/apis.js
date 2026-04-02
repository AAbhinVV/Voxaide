import { customAxios } from "../auth/apis";

export const generateNotesRequest = async (transcriptionId) => {
    const response = await customAxios.post(
        '/notes/generate',
        { transcriptionId },
        { withCredentials: true }
    );
    return response.data;
};

export const getNoteByIdRequest = async (id) => {
    const response = await customAxios.get(
        `/notes/${id}`,
        { withCredentials: true }
    );
    return response.data;
};