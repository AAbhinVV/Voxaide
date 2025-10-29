import express from 'express';
import dotenv from 'dotenv';
import userController from '../controller/user.controller.js';
import verifyJwt from '../middlewares/auth.middleware.js';

dotenv.config();
const router = express.Router();

router.use(verifyJwt);




// basic user profile CRUD
router.get('/me', userController.getMe);
router.post('/me', userController.updateMe);
router.patch('/me',  userController.partialUpdateMe);
router.delete('/me',  userController.deleteMe);

router.post('/me/avatar', upload.single('avatar'), userController.uploadAvatar);

router.get('/me/notes', userController.getMyNotes);

export default router;
