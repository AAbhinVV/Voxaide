import { answerGenerationService } from "../services/query/query.service";


const queryController = async (req,res) => {
    try {
        const { question } = req.body;

        if(!question){
            return res.status(400).json({ success: false, message: "Question is required" });
        }

        const userId = req.user._id;

        const result = await answerGenerationService({userId, question});

        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export default queryController;