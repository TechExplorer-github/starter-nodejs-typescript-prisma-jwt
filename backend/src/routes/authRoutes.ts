import express from "express";
import {
  signup,
  login,
  user,
  logout,
  refreshToken,
} from "../controllers/authController";
import { verifyToken } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/user", verifyToken, user);
router.delete("/logout", logout);
router.get("/refresh_token", refreshToken);

export default router;
