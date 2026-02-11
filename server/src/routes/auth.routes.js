import dotenv from "dotenv";
import {Router} from "express";
import authController from "../controller/auth.controller.js";
import { isAuth } from "../middlewares/auth.middleware.js";

dotenv.config();

const router = Router();

router.post("/signup", authController.register);

router.post("/verify/:token", authController.verifyUser);

// router.post('/verify', authController.verifyOTP)

router.post("/login", authController.login);

router.post("/logout", isAuth, authController.logout);

router.get("/me", isAuth, authController.myProfile);

router.post("/refresh-token", authController.refreshToken);

export default router;
