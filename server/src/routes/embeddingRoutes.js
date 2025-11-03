import express from 'express';
import dotenv from 'dotenv';

import generateEmbeds from '../controller/embedding.controller.js';

dotenv.config();

const router = express.Router();

router.post('/', generateEmbeds);
export default router;