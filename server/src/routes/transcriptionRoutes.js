import express from 'express';
import dotenv from 'dotenv';
import transcriptionController from '../controller/transcriptions.controller.js';
import upload from '../middlewares/multer.middleware.js';
import verifyJwt from '../middlewares/auth.middleware.js';

dotenv.config();

const router = express.Router();


router.post('/create', upload.single('audio'), transcriptionController.createTranscription);
router.get('/:note', transcriptionController.getTranscriptionByNoteId);
router.get('/', transcriptionController.getAllTranscriptions);
router.delete('/:note', transcriptionController.deleteTranscriptionById);
router.put('/:note', transcriptionController.UpdateTranscriptionById);

export default router;

 