import express from "express";
import queryController from "../controller/query.controller.js";
import { isAuth } from "../middlewares/auth.middleware.js";
import { queryLimiter } from "../middlewares/rateLimiter.middleware.js";

const router = express.Router();

router.post("/", isAuth, queryLimiter, queryController);

export default router;
