import express from 'express';
import dotenv from 'dotenv';
import userController from '../controller/user.controller.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import verifyJwt from '../middlewares/authMiddleware.js';

dotenv.config();
const router = express.Router();

router.use(verifyJwt);

// basic user profile CRUD
router.get('/me', userController.getMe);
router.post('/me', authMiddleware, userController.updateMe);
router.patch('/me', authMiddleware, userController.partialUpdateMe);
router.delete('/me', authMiddleware, userController.deleteMe);

router.post('/me/avatar', upload.single('avatar'), userController.uploadAvatar);

router.get('/me/notes', userController.getMyNotes);

export default router;
