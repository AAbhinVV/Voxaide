import express from 'express'
import { isAuth } from '../middlewares/auth.middleware.js'
import createNotes from '../controller/notes.controller.js'
import getNoteById from '../controller/notes.controller.js'

const router = express.Router();

router.post('/notes/generate', isAuth, createNotes);
router.get('/notes/:id', isAuth, getNoteById);

export default router;