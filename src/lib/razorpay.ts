import Razorpay from "razorpay";

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_51I2V3X4Y5Z6A7B", // real-format sandbox key fallback if not in .env
  key_secret: process.env.RAZORPAY_KEY_SECRET || "sec_test_secret_placeholder_value_123",
});
