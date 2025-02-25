import "server-only";

import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-11-20.acacia",
  appInfo: {
    name: "ecommerece demo",
    url: "http://localhost:3000",
  },
});
