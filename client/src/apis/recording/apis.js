import { customAxios } from "../auth/apis";

export const uploadVoiceNoteRequest = async (formData) => {
    const response = await customAxios.post(
        "/voice-notes",
        formData,
        {
            withCredentials: true,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
    return response.data;
};

export const getAllVoiceNotesRequest = async () => {
    const response = await customAxios.get("/voice-notes", {
        withCredentials: true,
    });
    return response.data;
};

export const getVoiceNoteByIdRequest = async (id) => {
    const response = await customAxios.get(`/voice-notes/${id}`, {
        withCredentials: true,
        responseType: "blob",
    });
    return response.data;
};

export const getVoiceNoteMetaByIdRequest = async (id) => {
    const response = await customAxios.get(`/voice-notes/${id}/meta`, {
        withCredentials: true,
    });
    return response.data;
};

export const deleteVoiceNoteRequest = async (id) => {
    const response = await customAxios.delete(`/voice-notes/${id}`, {
        withCredentials: true,
    });
    return response.data;
};