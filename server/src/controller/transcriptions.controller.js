import Transcription from "../../models/transcription.model";

const createTranscription = async (req, res) => {
    try {
        const { noteId, text } = req.body;
        if (!noteId || !text) {
            return res.status(400).json({ success: false, message: "noteId and text are required" });
        }

        const transcription = new Transcription({ noteId, text });
        await transcription.save();
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