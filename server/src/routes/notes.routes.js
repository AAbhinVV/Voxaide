import express from 'express'
import { isAuth } from '../middlewares/auth.middleware.js'
import createNotes from '../controller/notes.controller.js'
import getNoteById from '../controller/notes.controller.js'
import { notesLimiter } from '../middlewares/rateLimiter.middleware.js'

const router = express.Router();

router.post('/notes/generate', isAuth, notesLimiter, createNotes);
router.get('/notes/:id', isAuth, getNoteById);

export default router;