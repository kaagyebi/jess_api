import express from "express";
import { signup, login, logout } from "../controllers/authController.js";
import { signupValidation, loginValidation } from "../validators/authValidator.js";
import { validateRequest } from "../middleware/validateRequest.js";

const userRouter = express.Router();

// ================== AUTH ROUTES ==================
userRouter.post("/signup", signupValidation, validateRequest, signup);
userRouter.post("/login", loginValidation, validateRequest, login);
userRouter.post("/logout", logout);

export default userRouter;
