import express, { Request, Response } from "express";
import { Login, Signup } from "../controllers/authController";

const router = express.Router();

router.post("/signup", Signup);
router.post("/login", Login);

export default router;
