import axios from "axios";
import { Payment } from "../model/paymentModel.js"; 
import { User } from "../model/authModel.js";
import dotenv from "dotenv";

dotenv.config();

// Paystack Secret Key (from env file)
const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
console.log("Secret Key:",PAYSTACK_SECRET);


const PAYSTACK_BASE_URL = "https://api.paystack.co";

// ================== INITIALIZE PAYMENT ==================
export const initializePayment = async (req, res) => {
  console.log("Request Body:", req.body);
  try {
    const { userId, fullName, email, amount, paymentMethod, currency = "GHS" } = req.body;

    // Generate unique reference
    const reference = `txn_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

    // Convert amount to kobo/pesewas (Paystack requires smallest currency unit)
    const paystackAmount = amount * 100;

    // Create pending payment record in DB
    const payment = await Payment.create({
      user: userId || null, // optional
      fullName,
      email,
      amount,
      currency,
      paymentMethod,
      status: "pending",
      reference,
    });

    // Call Paystack API
    const response = await axios.post(
      `${PAYSTACK_BASE_URL}/transaction/initialize`,
      {
        email,
        amount: paystackAmount,
        currency,
        reference,
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({
      authorizationUrl: response.data.data.authorization_url,
      reference,
      payment,
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: err.message });
  }
};

// ================== VERIFY PAYMENT ==================
export const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.query;

    const response = await axios.get(
      `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
        },
      }
    );

    const paystackData = response.data.data;

    // Find payment record and update
    const payment = await Payment.findOneAndUpdate(
      { reference },
      {
        status: paystackData.status === "success" ? "success" : "failed",
        gatewayResponse: paystackData.gateway_response,
        transactionDate: paystackData.transaction_date,
        meta: paystackData,
      },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ message: "Payment record not found" });
    }

    res.status(200).json({ message: "Payment verified", payment });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: err.message });
  }
};
