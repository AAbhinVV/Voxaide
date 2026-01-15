import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OpenAIEmbeddings } from "@langchain/openai";
import { encoding_for_model } from "tiktoken";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import constants from "../config/constant.js";
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
    transcriptionText
}) => {
    //********************************************chunking the text************************************************
    const encoder = encoding_for_model("text-embedding-3-large");

    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 600,
        chunkOverlap: 120,
        separators: ["\n\n", "\n", " ", ""],
        lengthFunction: (text) => {
             encoder.encode(text).length;
            
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
        apiKey: constants.pinecone_api_key
    })

    const pineconeIndex = pinecone.Index("voxaide");

    const vectorStore = Promise.all(
        savedChunks.map(async (chunk) => {
            const embedding = await embeddings.embedDocuments(chunk.text);

            return{
                id: chunk._id.toString(),
                values: embedding,
                metadata: {
                    userId: userId.toString(),
                    transcriptionId: transcriptionId.toString(),
                    chunkIndex: chunk.chunkIndex,
                    type: "transcription_chunk"
                }
            }
        })
    );

    await pineconeIndex.upsert(vectorStore);


    const mongoStore = savedChunks.map((chunk) => ({
        updateOne: {
            filter: { _id: chunk._id },
            update: { embeddingId: chunk._id.toString()}
        }
    }))
    
    await TranscriptionChunk.bulkWrite(mongoStore);
    

    return {
        mongoDocId,
        totalChunks: savedChunks.length
    }

    

}

export default generateChunksAndEmbeddings;