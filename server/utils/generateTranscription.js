import fs from "fs";
import OpenAI from "openai";
import dotenv from "dotenv";
import { toFile } from 'openai/uploads'

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export const transcribeBuffer = async (buffer, filename = 'audio.webm') => {
    const file = await toFile(buffer, filename)
    const result = await openai.audio.transcriptions.create({
        file,
        model: "gpt-4o-transcribe",
    })
    return result.text
}

export const transcribeFilePath = async (filePath) => {
    const buffer = fs.readFileSync(filePath)
    const filename = filePath.split('/').pop() || 'audio.webm'
    return await transcribeBuffer(buffer, filename)
}