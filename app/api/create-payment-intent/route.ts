import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { amount, currency = "usd" } = req.body;

      // Create PaymentIntent
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        payment_method_types: ["card", "us_bank_account", "paypal"],
      });

      res.status(200).json({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (err) {
      res.status(500).json({
        error: "Error creating payment intent",
      });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
