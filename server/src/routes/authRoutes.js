import express from 'express'
import dotenv from 'dotenv'
import authController from '../controller/auth.controller.js'




dotenv.config()

const router = express.Router()

router.post('/register', authController.register)

router.post('/login', authController.login)

router.post('/logout', authController.logout)

router.get("/refresh-token", authController.refreshToken)

export default router;