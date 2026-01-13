import retrieveRelevantChunks from "./queryRetrieval.service.js";
import queryAnsweringService from "./queryAnswer.service.js"

export const answerGenerationService = async ({userId, question}) => {
    //retrieve relevant chunks
    const {chunkIds} =  await retrieveRelevantChunks({userId, question});
    //generate answer from chunks
    const result = await queryAnsweringService({userId, question, chunkIds});

    return result;
}