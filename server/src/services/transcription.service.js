import { OpenAI } from 'openai';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import constants from '../config/constant';
import voiceNoteModel from '../models/voiceNote.model';
import transcriptionModel from '../models/transcription.model';
import generateChunksAndEmbeddings from './embedding.service.js';


const s3 = new S3Client({ region: constants.aws_region});



const client = new OpenAI({apiKey: constants.openai_api_key});

const startTranscriptionJob = async (voiceNoteId, userId) => {
    const voiceNoteInstance = await voiceNoteModel.findOne({ _id: voiceNoteId, userId: userId });

    if(!voiceNoteInstance){
        throw new Error('Voice note not found. Recheck the ID');
    }

    if(voiceNoteInstance.status !== 'UPLOADED'){
        throw new Error('Voice note already processed or failed');
    }

    const s3Response = await s3.send(new GetObjectCommand({
        Bucket: constants.aws_bucket_name,
        Key: voiceNoteInstance.s3Key
    }));

    const voiceNote = s3Response.Body;

    if(!voiceNote){
        throw new Error('Voice note file not found in S3');
    }

    const response = await client.audio.transcriptions.create({
        file: voiceNote.Body,
        model: "gpt-4o-transcribe",

    })

    const transcription = response.output_text;

    if(!transcription){
        throw new Error('Transcription failed');
    }

    const transcriptionInstance = new transcriptionModel({
        userId,
        voiceNoteId,
        text: transcription,
        status: "COMPLETED"
    })

    await transcriptionInstance.save();

    voiceNoteInstance.status = 'TRANSCRIBED';
    await voiceNoteInstance.save();

    await generateChunksAndEmbeddings({
        transcriptionId: transcriptionInstance._id,
        userId,
        transcriptionText: transcription
    });


}

export default startTranscriptionJob;