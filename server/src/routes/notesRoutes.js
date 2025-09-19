import express from 'express';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import notesController from '../controller/notesController';


dotenv.config();
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({storage})

router.post('/voice', upload.single('audio'), notesController.uploadVoiceNote);

route.get('/voiceNote/:id', notesController.getVoiceNoteById);

route.get('/voiceNotes', notesController.getAllVoiceNotes);

export default router;
