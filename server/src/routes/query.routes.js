import express from 'express'
import { isAuth } from '../middlewares/auth.middleware.js'
import queryController from '../controller/query.controller.js'
import { queryLimiter } from '../middlewares/rateLimiter.middleware.js'

const router = express.Router()

router.post('/', isAuth, queryLimiter, queryController)

export default router;