import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/authRoute.js";
import paymentRouter from "./routes/paymentRoute.js";
import cors from "cors";


dotenv.config();
console.log(
  "Raw Secret Key with brackets:",
  `[${process.env.PAYSTACK_SECRET_KEY}]`
);


const app = express();
const PORT = process.env.PORT || 5300;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", userRouter);
app.use("/api/payment", paymentRouter);

// MongoDb Setup
const MONGO_URL = process.env.MONGO_URI;
await mongoose.connect(MONGO_URL);
console.log("Connected to MongoDB");

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
