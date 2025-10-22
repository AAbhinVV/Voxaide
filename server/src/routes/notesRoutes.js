import express, { application } from 'express';
import dotenv from 'dotenv';
import notesController from '../controller/notes.controller.js';
import notesMiddleware from '../middlewares/notesMiddleware.js';
import upload from '../middlewares/fileUploadMiddleware.js';
import verifyJwt from '../middlewares/authMiddleware.js';


dotenv.config();
const router = express.Router();

router.use(verifyJwt);
router.use(notesMiddleware);

router.post('/uploadVoice',upload.single('audio'), notesController.uploadVoiceNote);

router.get('/voiceNote/:id', notesController.getVoiceNoteById);

router.get('/voiceNotes', notesController.getAllVoiceNotes);

router.delete('/deleteVoiceNote/:id', notesController.deleteVoiceNote);

export default router;
