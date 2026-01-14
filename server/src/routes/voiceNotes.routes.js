import express, { application } from 'express';
import dotenv from 'dotenv';
import notesController from '../controller/voiceNotes.controller.js';
import notesMiddleware from '../middlewares/notes.middleware.js';
import upload from '../middlewares/multer.middleware.js';
import { isAuth } from '../middlewares/auth.middleware.js';
import { embedLimiter } from '../middlewares/rateLimiter.middleware.js';


dotenv.config();
const router = express.Router();
router.use(isAuth);



router.post('/voice-notes',upload.single('audio'), embedLimiter, notesController.uploadVoiceNote);

router.get('/voice-notes/:id', notesController.getVoiceNoteById);

router.delete('/voice-notes/:id', notesController.deleteVoiceNote);

export default router;
