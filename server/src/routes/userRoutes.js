import express from 'express';
import dotenv from 'dotenv';
import userController from '../controller/user.controller.js';
import authMiddleware from '../middlewares/authMiddleware.js';

dotenv.config();
const router = express.Router();

// basic user profile CRUD
router.get('/me', authMiddleware, userController.getMe);
router.put('/me', authMiddleware, userController.updateMe);
router.delete('/me', authMiddleware, userController.deleteMe);

export default router;
