import dotenv from "dotenv";
import express from "express";
import requireAdmin from "../middlewares/admin.middleware.js";
import { isAuth } from "../middlewares/auth.middleware.js";

// Note: Global middleware `verifyJwt` and `requireAdmin` are already applied in server.js

dotenv.config();

const router = express.Router();

router.use(isAuth);
router.use(requireAdmin);

// admin routes (protected upstream)
router.get("/", adminController.getAllUsers);
router.get("/:id", adminController.getUserById);
router.patch("/:id", adminController.updateUserById);
router.delete("/:id", adminController.deleteUserById);

export default router;
