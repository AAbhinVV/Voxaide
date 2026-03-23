import { customAxios } from "../auth/apis";

export const getTranscriptionByIdRequest = async (id) => {
    const response = await customAxios.get(
        `/transcription/${id}`,
        {
            withCredentials: true,
        }
    )
    return response.data
}