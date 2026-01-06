import notesGenerator from "../services/notes.service"

const createNotes = async (req, res) => {
    const {transcriptionId} = req.body;
    const userId = req.user.id;

    try{
        const notes = await notesGenerator(transcriptionId, userid);
        

        return res.status(200).json({succcess: true, message: "Notes generated successfully", data : notes});
    }catch(err){
        return  res.status(err.statuscode || 500).json({success: false, message: err.message});
    }
}



const getNoteById = async(req, res) => {

}

export default {createNotes, getNoteById};


