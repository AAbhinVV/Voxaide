import dotenv from "dotenv";
import express from "express";
import transcriptionController from "../controller/transcriptions.controller.js";
import { isAuth } from "../middlewares/auth.middleware.js";

dotenv.config();

const router = express.Router();

router.get("/:id", isAuth, transcriptionController.getTranscriptionById);

export default router;
