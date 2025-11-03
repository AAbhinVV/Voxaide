import { Pinecone } from '@pinecone-database/pinecone';

const apiKey = process.env.PINECONE_API_KEY;

if(!apiKey) {
  throw new Error('No Pinecone API key provided');
}

const pinecone = new Pinecone({apiKey});


//creating an index 
const noteIndex = pinecone.index('quickstart');