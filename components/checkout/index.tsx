"use client";
import React from "react";
// import { useCart } from "@/hooks/use-cart";
import { useRouter } from "next/navigation";
import CheckoutStep from "./checkout-step";
import { ShippingForm } from "./shipping-form";
import { Button } from "../ui/button";

const Checkout = () => {
  //   const { items, getTotalPrice, clearCart } = useCart();
  //   const router = useRouter();

  const [step, setStep] = React.useState(0);

  //   if (items.length === 0) {
  //     router.push("/cart");
  //     return null;
  //   }
  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <CheckoutStep currentStep={step} />

      {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2">{step === 0 && <ShippingForm />}</div>
      </div> */}
      <Button variant="outline" onClick={handleBack} disabled={step === 0}>
        Back
      </Button>
      <Button onClick={handleNext} disabled={step === -1}>
        {step === 3 ? "Place Order" : "Next"}
      </Button>
    </div>
  );
};

export default Checkout;
