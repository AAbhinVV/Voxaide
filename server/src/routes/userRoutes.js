import express from 'express';
import dotenv from 'dotenv';
import userController from '../controller/user.controller.js';


dotenv.config();
router = express.Router();


router.get('/')
