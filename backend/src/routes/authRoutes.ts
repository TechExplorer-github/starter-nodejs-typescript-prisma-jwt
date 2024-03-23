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
router.post("/logout", logout);
router.post("/refresh_token", refreshToken);
router.get("/user", verifyToken, user);

export default router;
