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




export const generateNotes = async (trancriptionText) => {
    const response = await client.responses.create({
    model: "gpt-4.1-mini",
    temperature: 0.2,
    input: [{
        role: "system",
        content:  
        `You are an assistant that converts meeting transcripts into structured notes.

        You MUST return valid JSON only.
        Do NOT include markdown.
        Do NOT include explanations.
        Do NOT include extra text.

        The JSON must strictly match this schema:
        {
        "title": string,
        "summary": string,
        "bulletPoints": string[],
        "actionItems": string[]
        }
        `.trim()
    },{
        role: "user",
        content: `Transcription: ${trancriptionText}`.trim()
    }]

    
});

    const outputText = response.output_text;

    let notes;
    try {
        notes = JSON.parse(outputText);
    } catch (error) {
        throw new Error("AI returned invalid json for notes");
    }

    if(!notes.title || !notes.summary || !Array.isArray(notes.bulletPoints) || !Array.isArray(notes.actionItems)){
        throw new Error("AI notes output failed schema validation");
    }

    return {
        title: notes.title.trim(),
        summary: notes.summary.trim(),
        bulletPoints: notes.bulletPoints.map(point => point.trim()).filter(Boolean),
        actionItems: notes.actionItems.map(item => item.trim()).filter(Boolean)
    };

    
};

