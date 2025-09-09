import express from "express";
import { initializePayment, verifyPayment } from "../controllers/paymentController.js";

const paymentRouter = express.Router();

// ================== PAYMENT ROUTES ==================
paymentRouter.post("/initialize", initializePayment); // start payment
paymentRouter.get("/verify", verifyPayment); // verify payment after callback

export default paymentRouter;
