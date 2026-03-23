import { customAxios } from "../auth/apis";

export const generateNotesRequest = async (transcriptionId) => {
    response = customAxios.post(
        '/notes/generate',
        { transcriptionId },
        { withCredentials: true }
    )
    return response.data
}

export const getNoteByIdRequest = async (id) => {
    response = customAxios.get(
        `/notes/${id}`,
        { withCredentials: true }
    )
    return response.data
}