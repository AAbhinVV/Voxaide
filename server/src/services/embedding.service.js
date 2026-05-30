import { GoogleGenerativeAI } from "@google/generative-ai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import env from "../config/env.js";
import TranscriptionChunk from "../models/chunks.model.js";

const genAI = new GoogleGenerativeAI(env.google_api_key);
const embeddingModel = genAI.getGenerativeModel({ model: "gemini-embedding-2" });

/**
 * Generate embedding for a text using Google's text-embedding-004
 * @param {string} text
 * @returns {Promise<number[]>}
 */
async function embedText(text) {
	const result = await embeddingModel.embedContent({
		content: { parts: [{ text }] },
		outputDimensionality: 1024,
	});
	return result.embedding.values;
}

/**
 * @param {ObjectId} transcriptionId
 * @param {ObjectId} userId
 * @param {string} transcriptionText
 */
const generateChunksAndEmbeddings = async ({
	transcriptionId,
	userId,
	transcriptionText,
}) => {
	//********************************************chunking the text************************************************
	const splitter = new RecursiveCharacterTextSplitter({
		chunkSize: 600,
		chunkOverlap: 120,
		separators: ["\n\n", "\n", " ", ""],
	});

	const chunks = await splitter.splitText(transcriptionText);

	if (!chunks || chunks.length === 0) {
		throw new Error("No chunks generated from the transcription text");
	}

	const chunkDocs = chunks.map((text, index) => ({
		userId,
		transcriptionId,
		chunkIndex: index,
		text,
	}));

	const savedChunks = await TranscriptionChunk.insertMany(chunkDocs);

	//********************************************storing in pinecone************************************************
	const pinecone = new PineconeClient({
		apiKey: env.pinecone_api_key,
	});

	const pineconeIndex = pinecone.Index("voxaide");

	const vectorStore = await Promise.all(
		savedChunks.map(async (chunk) => {
			const embedding = await embedText(chunk.text);

			return {
				id: chunk._id.toString(),
				values: embedding,
				metadata: {
					userId: userId.toString(),
					transcriptionId: transcriptionId.toString(),
					chunkIndex: chunk.chunkIndex,
					type: "transcription_chunk",
				},
			};
		}),
	);

	await pineconeIndex.upsert(vectorStore);

	const mongoStore = savedChunks.map((chunk) => ({
		updateOne: {
			filter: { _id: chunk._id },
			update: { embeddingId: chunk._id.toString() },
		},
	}));

	await TranscriptionChunk.bulkWrite(mongoStore);

	return {
		mongoDocId: savedChunks[0]._id,
		totalChunks: savedChunks.length,
	};
};

export default generateChunksAndEmbeddings;
