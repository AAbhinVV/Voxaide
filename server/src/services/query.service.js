import { querySchema } from "../config/zod"
import { tool } from "@langchain/core/tools";

const queryService = async (userId, question) => {
    //retrieve query and create query embedding
    

    //search pinecone for top k chunks using userId filter


    //construct prompt call LLm retrieve answer
}