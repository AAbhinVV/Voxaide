import express from 'express';
import dotenv from 'dotenv';
import transcriptionController from '../controller/transcriptions.controller.js';
import upload from '../middlewares/fileUploadMiddleware.js';
import verifyJwt from '../middlewares/authMiddleware.js';

dotenv.config();

const router = express.Router();

router.use(verifyJwt);

router.post('/create', upload.single('audio'), transcriptionController.createTranscription);
router.get('/note/:noteId', transcriptionController.getTranscriptionByNoteId);
router.get('/', transcriptionController.getAllTranscriptions);
router.delete('/:noteId', transcriptionController.deleteTranscriptionById);
router.put('/:noteId', transcriptionController.UpdateTranscriptionById);

export default router;

 