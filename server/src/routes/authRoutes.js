import express from 'express'
import dotenv from 'dotenv'
import authController from '../controller/auth.controller.js'
import { isAuth } from '../middlewares/auth.middleware.js'




dotenv.config()

const router = express.Router()

router.post('/register', authController.register)

router.post('/verify/:token', authController.verifyUser)

router.post('/verify', authController.verifyOTP)

router.post('/login', authController.login)

router.post('/logout', isAuth, authController.logout)

router.get('/me', isAuth, authController.myProfile)

router.get("/refresh-token", authController.refreshToken)

export default router;