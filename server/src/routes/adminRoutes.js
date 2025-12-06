import express from 'express';
import dotenv from 'dotenv';
import adminController from '../controller/admin.controller.js';
// Note: Global middleware `verifyJwt` and `requireAdmin` are already applied in server.js

dotenv.config();

const router = express.Router();


// admin routes (protected upstream)
router.get('/', adminController.getAllUsers);
router.get('/:id', adminController.getUserById);
router.patch('/:id', adminController.updateUserById);
router.delete('/:id', adminController.deleteUserById);

export default router;