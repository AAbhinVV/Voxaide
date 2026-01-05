import express from 'express';
import dotenv from 'dotenv';
import transcriptionController from '../controller/transcriptions.controller.js';
import upload from '../middlewares/multer.middleware.js';
import verifyJwt from '../middlewares/auth.middleware.js';

dotenv.config();

const router = express.Router();



router.post('/transcriptions/id', transcriptionController.getTranscriptionById);

export default router;

 