import { getEmbedding } from '../utils/openAI_func.js';

const generateEmbeds = async (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: 'No text provided' });
    }

    try {
        const embedding = await getEmbedding(text);
        res.json({ embedding });
    } catch (error) {
        console.error('Error generating embedding:', error);
        res.status(500).json({ error: 'Failed to generate embedding' });
    }
}

export default { generateEmbeds };