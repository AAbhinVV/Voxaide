import express from 'express'

const router = express.Router();

router
.post('/notes/generate')
.get('notes/:id')

export default router;