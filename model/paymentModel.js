import { Schema, model } from "mongoose";

const paymentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false, // make optional in case it's a guest checkout
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "GHS",
    },
    paymentMethod: {
      type: String,
      enum: ["card", "momo"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    reference: {
      type: String,
      required: true,
      unique: true, // Paystack transaction reference
    },
    gatewayResponse: {
      type: String,
    },
    transactionDate: {
      type: Date,
      default: Date.now,
    },
    meta: {
      type: Object, // store any extra data Paystack returns
    },
  },
  { timestamps: true }
);

export const Payment = model("Payment", paymentSchema);
