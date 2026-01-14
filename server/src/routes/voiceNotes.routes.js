import express, { application } from 'express';
import dotenv from 'dotenv';
import voiceNotesController from '../controller/voiceNotes.controller.js'
import upload from '../middlewares/multer.middleware.js';
import { isAuth } from '../middlewares/auth.middleware.js';
import { embedLimiter } from '../middlewares/rateLimiter.middleware.js';


dotenv.config();
const router = express.Router();
router.use(isAuth);



router.post('/',upload.single('audio'), embedLimiter, voiceNotesController.createVoiceNote);

router.get('/', voiceNotesController.getAllVoiceNotes);

router.get('/:id', voiceNotesController.getVoiceNoteById);

router.delete('/:id', voiceNotesController.deleteVoiceNote);

export default router;
