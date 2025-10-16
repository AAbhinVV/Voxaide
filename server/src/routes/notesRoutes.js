import express from 'express';
import dotenv from 'dotenv';
import notesController from '../controller/notes.controller.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import notesMiddleware from '../middlewares/notesMiddleware.js';
import upload from '../middlewares/fileUploadMiddleware.js';



dotenv.config();
const router = express.Router();

router.post('/uploadVoice', authMiddleware, upload.single('audio'), notesMiddleware, notesController.uploadVoiceNote);

router.get('/voiceNote/:id', notesController.getVoiceNoteById);

router.get('/voiceNotes', notesController.getAllVoiceNotes);

router.delete('/deleteVoiceNote/:id', notesController.deleteVoiceNote);

export default router;
