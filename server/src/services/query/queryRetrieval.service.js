import { querySchema } from "../../config/zod";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Pinecone } from "@pinecone-database/pinecone";
import constants from "../../config/constant";

const retrieveRelevantChunks = async ({userId, question}) => {
    //retrieve query and create query embedding
    const queryValidation = querySchema.safeParse({query: question});
    if(!queryValidation.success){
        throw new Error("Invalid query input");
    }else{
        console.log("Query validated")
    }

    const embeddings = new OpenAIEmbeddings({
        modelName: "text-embedding-3-large"
    })

    const queryEmbeddings = await embeddings.embedQuery(question)

    //search pinecone for top k chunks using userId filter
    
    const pinecone = new Pinecone({
        apiKey: constants.pinecone_api_key
    })

    const pineconeIndex = pinecone.index("voxaide");

    const queryResponse = await pineconeIndex.query({
        vector: queryEmbeddings,
        topK: 10,
        includeMetadata: true,
        filter: {
            userId: userId.toString(),
            type: "transcription_chunk"
        }
    });

    const matches = queryResponse.matches;
    const chunkIds = matches.map((match)=> match.id) 

    return {
        chunkIds,
        matches
    }

}

export default retrieveRelevantChunks;