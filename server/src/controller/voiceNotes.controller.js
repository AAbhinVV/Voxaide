import voiceNote from '../models/voiceNote.model.js';
import path from 'path';



const createVoiceNote = async (req,res) => {
    try{
        if(!req.file) {
            return res.status(400).json({message: "No file uploaded"});
        }

        const userId = req.user._id;

        const voiceNoteInstance = new voiceNote({
            userId,
            filename: req.file.originalname,
            duration: req.body.duration,
            s3Key: req.file.key,
            s3Url: req.file.location,
            contentType: req.file.mimetype,
            size: req.file.size,
            status: 'UPLOADED'
        })

        await voiceNoteInstance.save();

        startTranscriptionJob(voiceNoteInstance._id);

        res.status(201).json({
            success: true, 
            message: "Audio received", 
            voiceNoteId: voiceNoteInstance._id
        });
        }catch(error){
            res.status(503).json({success: false, message:error.message});
        }
}

const getVoiceNoteById = async (req,res) => {
    const noteId = req.params.id;
    try {
        const note = await voiceNote.findById(noteId);
        if(!note){
            return res.status(400).json({success: false, message: "note not found"});
        }

        const absolutePath = path.resolve(process.cwd(), note.audiopath);

        res.status(200).sendFile(absolutePath, (err) => {
            if(err){
               console.error("Error sending file:", err);
            }
        })
    } catch (error) {
        res.status(503).json({success: false, message:error.message});
    }
}

const getAllVoiceNotes = async (req,res) => {
    try{
        const note = await voiceNote.find();
        res.status(200).json({success: true, notes: note});
    }catch(error){
        res.status(503).json({success: false, message:error.message});
    }
}

const deleteVoiceNote = async (req,res) => {
    try{
        const noteId = req.params.id;
        const note = await voiceNote.findByIdAndDelete(noteId);
        if(!note){
            return res.status(400).json({success: false, message: "Note not found"});
        }
        res.status(200).json({success: true, message: "Note deleted successfully"});
    }catch(error){
        res.status(503).json({success: false, message: error.message});
    }
}




export default{createVoiceNote, getVoiceNoteById, getAllVoiceNotes, deleteVoiceNote};