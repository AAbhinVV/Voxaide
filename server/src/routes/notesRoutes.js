import express from 'express';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import notesController from '../controller/notes.controller.js';



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

router.post('/uploadVoice', upload.single('audio'), notesController.uploadVoiceNote);

router.get('/voiceNote/:id', notesController.getVoiceNoteById);

router.get('/voiceNotes', notesController.getAllVoiceNotes);

router.delete('/deleteVoiceNote/:id', notesController.deleteVoiceNote);

export default router;
