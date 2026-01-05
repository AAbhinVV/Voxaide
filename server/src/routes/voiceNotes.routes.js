import express, { application } from 'express';
import dotenv from 'dotenv';
import notesController from '../controller/voiceNotes.controller.js';
import notesMiddleware from '../middlewares/notes.middleware.js';
import upload from '../middlewares/multer.middleware.js';
import verifyJwt from '../middlewares/auth.middleware.js';


dotenv.config();
const router = express.Router();
router.use(verifyJwt);



router.post('/voice-notes',upload.single('audio'), notesController.uploadVoiceNote);

router.get('/voice-notes/:id', notesController.getVoiceNoteById);

router.delete('/voice-notes/:id', notesController.deleteVoiceNote);

export default router;
