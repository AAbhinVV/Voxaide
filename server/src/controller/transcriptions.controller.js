import Transcription from "../../models/transcription.model.js";
import Note from "../../models/notes.model.js";
import { transcribeBuffer } from "../../utils/openAI_func.js";

const createTranscription = async (req, res) => {
    try {
        const { noteId } = req.body;
        const hasBlob = !!req.file || !!req.body?.audio;

        if (!noteId && !hasBlob) {
            return res.status(400).json({ success: false, message: "Provide noteId or audio blob" });
        }

        let text = req.body?.text;

        if (!text && hasBlob) {
            const filename = req.file?.originalname || 'audio.webm';
            const buffer = req.file ? req.file.buffer : Buffer.from(req.body.audio, 'base64');
            text = await transcribeBuffer(buffer, filename);
        }

        if (!text) {
            return res.status(400).json({ success: false, message: "No transcription text obtained" });
        }

        let targetNoteId = noteId;
        if (!targetNoteId && req.file) {
            // optional: create a note placeholder if only blob is sent
            const note = new Note({ filename: filename, audiopath: '', transcription: text });
            await note.save();
            targetNoteId = note._id;
        }

        const transcription = new Transcription({ noteId: targetNoteId, text });
        await transcription.save();

        // also update note's transcription field if noteId provided
        if (targetNoteId) {
            await Note.findByIdAndUpdate(targetNoteId, { transcription: text });
        }

        res.status(201).json({ success: true, transcription });
    } catch (error) {
        res.status(503).json({ success: false, message: error.message });
    }
};

const getTranscriptionByNoteId = async (req, res) => {
    const { noteId } = req.params;
    try {
        const transcriptions = await Transcription.find({ noteId: noteId });
        if (!transcriptions || transcriptions.length === 0) {
            return res.status(404).json({ success: false, message: "No transcriptions found for this note" });  
        }
        res.status(200).json({ success: true, transcriptions });
    } catch (error) {
        res.status(503).json({ success: false, message: error.message });
    }
};

const getAllTranscriptions = async (req,res) => {
    try{
        const transcriptions = await Transcription.find();
        if(!transcriptions){
            return res.status(404).json({success: false, message: "no Transcriptions found"});
            }
        res.status(200).json({success: true, transcriptions});
    }catch(error){  
        res.status(503).json({success: false, message:error.message});
    }
};  

const deleteTranscriptionById = async (req,res) => { 
    try{
        const { noteId } = req.params;
        const transcription = await Transcription.findByIdAndDelete(noteId);
        if(!transcription){
            return res.status(400).json({success: false, message: "Transcription not found"});
        }   
        res.status(200).json({success: true, message: "Transcription deleted successfully"});
    }catch(error){
        res.status(503).json({success: false, message:error.message});
    }
};

const UpdateTranscriptionById = async (req,res) => {
    try{
        const { noteId } = req.params;
        const { text } = req.body;
        const transcription = await Transcription.findByIdAndUpdate(noteId, { text, updatedAt: Date.now() }, { new: true });
        if(!transcription){
            return res.status(400).json({success: false, message: "Transcription not found"});
        }
        return res.status(200).json({success: true, transcription});    
    }catch(error){
        res.status(503).json({success: false, message:error.message});
    }
};

export default {
    createTranscription,
    getTranscriptionByNoteId,
    getAllTranscriptions,
    deleteTranscriptionById,
    UpdateTranscriptionById
};