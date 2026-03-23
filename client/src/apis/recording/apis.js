import { customAxios } from "../auth/apis";

export const uploadVoiceNoteRequest = async (formData) => {
    const response = await customAxios.post(
        "/voice-note",
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
    const response = await customAxios.get("/voice-note", {
        withCredentials: true,
    });
    return response.data;
};

export const getVoiceNoteByIdRequest = async (id) => {
    const response = await customAxios.get(`/voice-note/${id}`, {
        withCredentials: true,
    });
    return response.data;
};

export const deleteVoiceNoteRequest = async (id) => {
    const response = await customAxios.delete(`/voice-note/${id}`, {
        withCredentials: true,
    });
    return response.data;
};