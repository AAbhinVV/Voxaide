import { GoogleGenerativeAI } from "@google/generative-ai";
import env from "../config/env.js";

const genAI = new GoogleGenerativeAI(env.google_api_key);

export const generateNotes = async (transcriptionText) => {
	const model = genAI.getGenerativeModel({
		model: "gemini-2.0-flash",
		generationConfig: {
			temperature: 0.2,
			responseMimeType: "application/json",
		},
	});

	const systemPrompt = `You are an assistant that converts meeting transcripts into structured notes.

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
}`;

	const result = await model.generateContent([
		{ text: systemPrompt },
		{ text: `Transcription: ${transcriptionText}` },
	]);

	const outputText = result.response.text();

	let notes;
	try {
		notes = JSON.parse(outputText);
	} catch (error) {
		throw new Error("AI returned invalid json for notes");
	}

	if (
		!notes.title ||
		!notes.summary ||
		!Array.isArray(notes.bulletPoints) ||
		!Array.isArray(notes.actionItems)
	) {
		throw new Error("AI notes output failed schema validation");
	}

	return {
		title: notes.title.trim(),
		summary: notes.summary.trim(),
		bulletPoints: notes.bulletPoints
			.map((point) => point.trim())
			.filter(Boolean),
		actionItems: notes.actionItems.map((item) => item.trim()).filter(Boolean),
	};
};
