import Note from '../../models/notes.model.js';
import path from 'path';
import { transcribeFilePath } from '../../utils/openAI_func.js'


const uploadVoiceNote = async (req,res) => {
    try{
        if(!req.file) {
            return res.status(400).json({message: "No file uploaded"});
        }

        const note = new Note({
            audiopath: req.file.path,
            filename: req.file.originalname,
            userId: req.user?.userId,
            title: req.body.title,
            tags: req.body?.tags,
            transcription: req.body.transcription,
        })

        await note.save();

        // if no transcription provided by client, attempt server-side transcription
        if (!note.transcription) {
            try {
                const text = await transcribeFilePath(req.file.path)
                note.transcription = text
                await note.save()
            } catch (e) {
                // non-fatal
                console.error('Transcription failed:', e.message)
            }
        }

            res.status(200).json({
                success: true, 
                message: "Audio recieved", 
                noteId: note._id,
                audiopath: note.audiopath,
                filename: req.file.originalname
            });
        }catch(error){
            res.status(503).json({success: false, message:error.message});
        }
}

const getVoiceNoteById = async (req,res) => {
    const noteId = req.params.id;
    try {
        const note = await Note.findById(noteId);
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
        const note = await Note.find();
        res.status(200).json({success: true, notes: note});
    }catch(error){
        res.status(503).json({success: false, message:error.message});
    }
}

const deleteVoiceNote = async (req,res) => {
    try{
        const noteId = req.params.id;
        const note = await Note.findByIdAndDelete(noteId);
        if(!note){
            return res.status(400).json({success: false, message: "Note not found"});
        }
        res.status(200).json({success: true, message: "Note deleted successfully"});
    }catch(error){
        res.status(503).json({success: false, message: error.message});
    }
}




export default{uploadVoiceNote, getVoiceNoteById, getAllVoiceNotes, deleteVoiceNote};