import { GoogleGenerativeAI } from "@google/generative-ai";
import TranscriptionChunk from "../../models/chunks.model.js";
import env from "../../config/env.js";

const genAI = new GoogleGenerativeAI(env.google_api_key);

const queryAnsweringService = async ({ userId, question, chunkIds }) => {
	const chunkTexts = await TranscriptionChunk.find({
		_id: { $in: chunkIds },
		userId,
	}).sort({ chunkIndex: 1 });

	if (!chunkTexts || chunkTexts.length === 0) {
		return {
			answer: "No relevant chunks found for the query.",
			sources: [],
		};
	}

	const context = chunkTexts
		.map((chunk, i) => `Chunk ${i + 1}: \n${chunk.text}`)
		.join("\n\n");

	const systemPrompt = `You are an assistant answering questions strictly based on the provided context.
                    If the answer is not present in the context, say "I couldn't find the answer based on the information provided."
                    Do not use any outside knowledge.`;

	const userPrompt = `Context: ${context} Question: ${question}`;

	const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

	const result = await model.generateContent([
		{ text: systemPrompt },
		{ text: userPrompt },
	]);

	const answer = result.response.text()?.trim();

	return {
		answer,
		sources: chunkIds,
	};
};

export default queryAnsweringService;
