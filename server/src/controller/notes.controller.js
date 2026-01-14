import notesGenerator from "../services/notes.service"

const createNotes = async (req, res) => {
    const {transcriptionId} = req.body;
    const userId = req.user._id;

    try{
        const notes = await notesGenerator(transcriptionId, userId);
        

        return res.status(200).json({succcess: true, message: "Notes generated successfully", data : notes});
    }catch(err){
        return  res.status(err.statuscode || 500).json({success: false, message: err.message});
    }
}



const getNoteById = async(req, res) => {
    try {
        const noteId = req.params.id;
        if(!noteId){
            return res.status(400).json({success: false, message: "Note id is required"});
        }

        const note = await noteModel.findOne({_id: noteId, userId: req.user._id})

        if(!note){
            return res.status(404).json({success: false, message: "Note not found"});
        }

        return res.status(200).json({success: true, data: note});
    } catch (error) {
        return res.status(500).json({success: false, message: error.message});
    }

}

export default {createNotes, getNoteById};


