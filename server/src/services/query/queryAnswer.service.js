
import OpenAI from "openai";
import TranscriptionChunk from "../../models/chunks.model.js";



const queryAnsweringService = async ({userId, question, chunkIds}) => {
    const openai = new OpenAI({apiKey: constants.openai_api_key});

    const chunkTexts = await TranscriptionChunk.find({_id: { $in: chunkIds }, userId }).sort({chunkIndex: 1});

    if(!chunkTexts || chunkTexts.length ===0){
        return {
            answer: "No relevant chunks found for the query.",
            sources: []
        }
    }

    const context = chunkTexts.map((chunk, i) => `Chunk ${i+1}: \n${chunk.text}`).join("\n\n");

    const systemPrompt = `You are an assistant answering questions strictly based on the provided context.
                    If the answer is not present in the context, say "I couldn't find the answer based on the information provided."
                    Do not use any outside knowledge.`  

    const userPrompt = `Context: ${context} Question: ${question}`

    const response = await openai.responses.create({
        model: "gpt-5",
        input: [
            {role: "system", context: systemPrompt},
            {role: "user", context: userPrompt}
        ]
    })

    const answer = response.output_text?.trim()

    return {
        answer,
        sources: chunkIds
    }
}


export default queryAnsweringService;