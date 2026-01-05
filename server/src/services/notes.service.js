import transcriptionModel from "../models/transcription.model"
import noteModel from "../models/note.model";

const notesGenerator = async (transcriptionId, userId, ) => {
    const transcription = await transcriptionModel.findOne({_id: transcriptionId, userId: userId});
    
    if(!transcription){
        throw new Error("Transcription not found");
    }

    if(transcription.status !== 'COMPLETED'){
        throw new Error("Transcription not completed yet");
    }

    const notes = await noteModel.findOne({transcriptionId: transcriptionId, userId: userId});
    if(notes){
        return notes;
    }



}