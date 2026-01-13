import express from 'express'
import { isAuth } from '../middlewares/auth.middleware.js'
import queryController from '../controller/query.controller.js'

const router = express.Router()

router.post('/query', isAuth, queryController)

export default router;