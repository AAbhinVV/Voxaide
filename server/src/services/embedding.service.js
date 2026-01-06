import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OpenAIEmbeddings } from "@langchain/openai";
import { encoding_for_model } from "tiktoken";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import constants from "../config/constant.js";
import TrancriptionChunk from "../models/chunks.model.js";




/**
 * @param {ObjectId} mongoDocId - MongoDB document _id
 * @param {string} text - transcription or document text
 * @param {Object} extraMetadata - optional metadata
 */
const generateChunksAndEmbeddings = async ({
    transcriptionId,
    userId,
    transcriptionText
}) => {
    //********************************************chunking the text************************************************
    const encoder = encoding_for_model("text-embedding-3-large");

    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
        separators: ["\n\n", "\n", " ", ""],
        lengthFunction: (text) => {
            const tokens = encoder.encode(text).length;
            return tokens;
        }
    })

    const chunks = await splitter.splitText(transcriptionText);
    encoder.free();

    if(!chunks || chunks.length ===0){
        throw new Error("No chunks generated from the transcription text");
    }

    const chunkDocs = chunks.map((text, index) => ({
        userId,
        transcriptionId,
        chunkIndex: index,
        text
    }))

    const savedChunks = await TranscriptionChunk.insertMany(chunkDocs);


    //**********************************creating embeddings for each chunk**************************************
    const embeddings = new OpenAIEmbeddings({
        modelName: "text-embedding-3-large"
    });

    


    //********************************************storing in pinecone************************************************
    const pinecone= new PineconeClient({
        apiKey: constants.pinecone_api_key,
    })

    const pineconeIndex = pinecone.Index("voxaide");

    const vectorStore = new PineconeStore(embeddings, {
        pineconeIndex,
        maxConcurrency: 10,
    })


     const metadatas = chunks.map((_, index) => ({
    mongoDocId: mongoDocId.toString(),
    chunkIndex: index,
    userId: userId?.toString(),
    source,
    }));

    await vectorStore.addTexts(chunks, metadatas);

    return {
        mongoDocId,
        totalChunks: chunks.length
    }

    

}