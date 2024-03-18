import express from "express";
import { signup, login, user, logout } from "../controllers/authController";
import verifyToken from "../middleware/verifyToken";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/user", verifyToken, user);
router.delete("/logout", logout);

export default router;
