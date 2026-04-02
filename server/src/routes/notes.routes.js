import express from "express";
import notesController from "../controller/notes.controller.js";
import { isAuth } from "../middlewares/auth.middleware.js";
import { notesLimiter } from "../middlewares/rateLimiter.middleware.js";

const router = express.Router();

router.post("/generate", isAuth, notesLimiter, notesController.createNotes);
router.get("/:id", isAuth, notesController.getNoteById);

export default router;
