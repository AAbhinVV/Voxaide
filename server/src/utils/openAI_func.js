import fs from "fs";
import dotenv from "dotenv";
import { toFile } from 'openai/uploads'
import constants from "constants";
import OpenAI from "openai";

dotenv.config();
const apiKey = constants.openai_api_key;

if(!apiKey){throw new Error('No OpenAI API key provided');}


const client = new OpenAI({apiKey});


export const transcribeBuffer = async (buffer, filename = 'audio.webm') => {
    const file = await toFile(buffer, filename)
    const transcription = await client.audio.transcriptions.create({
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
    const response = await client.embeddings.create({
        model: "text-embedding-ada-002",
        input: text,
        encoding_format: "float",
    })
    
    return response;

}


export const generateNotes = async (trancriptionText) => {
    const response = await client.responses.create({
    model: "gpt-5",
    reasoning: {efforts: "low"},
    input: [{
        
    }      
    ]
});
}