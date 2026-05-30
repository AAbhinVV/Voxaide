import { GoogleGenerativeAI } from "@google/generative-ai";
import { Pinecone } from "@pinecone-database/pinecone";
import env from "../../config/env.js"
import {querySchema} from "../../config/zod.js"

const genAI = new GoogleGenerativeAI(env.google_api_key);
const embeddingModel = genAI.getGenerativeModel({ model: "gemini-embedding-2" });

const retrieveRelevantChunks = async ({ userId, question }) => {
	//retrieve query and create query embedding
	const queryValidation = querySchema.safeParse({ query: question });
	if (!queryValidation.success) {
		throw new Error("Invalid query input");
	} else {
		console.log("Query validated");
	}

	const result = await embeddingModel.embedContent({
		content: { parts: [{ text: question }] },
		outputDimensionality: 1024,
	});
	const queryEmbeddings = result.embedding.values;

	//search pinecone for top k chunks using userId filter
	const pinecone = new Pinecone({
		apiKey: env.pinecone_api_key,
	});

	const pineconeIndex = pinecone.index("voxaide");

	const queryResponse = await pineconeIndex.query({
		vector: queryEmbeddings,
		topK: 10,
		includeMetadata: true,
		filter: {
			userId: userId.toString(),
			type: "transcription_chunk",
		},
	});

	const matches = queryResponse.matches;
	const chunkIds = matches.map((match) => match.id);

	return {
		chunkIds,
		matches,
	};
};

export default retrieveRelevantChunks;
