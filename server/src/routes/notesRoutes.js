import express, { application } from 'express';
import dotenv from 'dotenv';
import notesController from '../controller/notes.controller.js';
import notesMiddleware from '../middlewares/notes.middleware.js';
import upload from '../middlewares/multer.middleware.js';
import verifyJwt from '../middlewares/auth.middleware.js';


dotenv.config();
const router = express.Router();



router.post('/uploadVoice',upload.single('audio'), notesController.uploadVoiceNote);

router.get('/:voiceNote', notesController.getVoiceNoteById);

router.get('/', notesController.getAllVoiceNotes);

router.delete('/:voiceNote', notesController.deleteVoiceNote);

export default router;
