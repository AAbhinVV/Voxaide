import fs from "fs";
import { OpenAI } from "openai";
import dotenv from "dotenv";
import { toFile } from 'openai/uploads'
import constants from "constants";

dotenv.config();
const apiKey = constants.openai_api_key;

if(!apiKey){throw new Error('No OpenAI API key provided');}


const openai = new OpenAI({apiKey});


export const transcribeBuffer = async (buffer, filename = 'audio.webm') => {
    const file = await toFile(buffer, filename)
    const transcription = await openai.audio.transcriptions.create({
        file,
        model: "gpt-4o-transcribe",
    })
    return transcription.text
}

export const transcribeFilePath = async (filePath) => {
    const buffer = fs.readFileSync(filePath)
    const filename = filePath.split('/').pop() || 'audio.webm'
    return await transcribeBuffer(buffer, filename)
}

export const getEmbedding = async (text) => {
    const response = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: text,
        encoding_format: "float",
    })
    
    return response;

}