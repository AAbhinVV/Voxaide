import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import env from "../config/env.js";
import TranscriptionChunk from "../models/chunks.model.js";

/**
 * @param {ObjectId} mongoDocId - MongoDB document _id
 * @param {string} text - transcription or document text
 * @param {Object} extraMetadata - optional metadata
 * @param {ObjectId} userId
 * @param {ObjectId} transcriptionId
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

	//**********************************creating embeddings for each chunk**************************************
	const embeddings = new GoogleGenerativeAIEmbeddings({
		modelName: "text-embedding-004",
		apiKey: env.google_api_key,
	});

	//********************************************storing in pinecone************************************************
	const pinecone = new PineconeClient({
		apiKey: env.pinecone_api_key,
	});

	const pineconeIndex = pinecone.Index("voxaide");

	const vectorStore = await Promise.all(
		savedChunks.map(async (chunk) => {
			const embedding = await embeddings.embedDocuments([chunk.text]);

			return {
				id: chunk._id.toString(),
				values: embedding[0],
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
