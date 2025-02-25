"use client";
import React from "react";
import CheckoutStep from "./checkout-step";
import { ShippingForm } from "./shipping-form";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paymentSchema, shippingSchema } from "./checkoutSchema";
import ElementsForm from "./ElementForm";

const schemas = [shippingSchema, paymentSchema];

const Checkout = () => {
  const [step, setStep] = React.useState(0);

  const form = useForm({
    resolver: zodResolver(schemas[step]),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipcode: "",
      cardNumber: "",
      cardName: "",
      expiry: "",
      cvv: "",
    },
    mode: "onBlur",
  });

  const handleNext = async () => {
    const isValid = await form.trigger();
    if (isValid) {
      form.clearErrors();
      setStep((prev) => Math.min(prev + 1, 2));
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const onSubmit = async (data: any) => {
    if (step === 1) {
      // Handle Stripe Payment Submission
      const stripeResult = await ElementsForm.handlePayment();
      if (stripeResult.success) {
        console.log("Payment successful", data);
        // Proceed with order placement logic
      } else {
        console.error("Payment failed", stripeResult.error);
        return;
      }
    } else {
      console.log("Shipping data:", data);
      handleNext();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CheckoutStep currentStep={step} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2">
              <Card className="p-6">
                {step === 0 && <ShippingForm />}
                {step === 1 && <ElementsForm />}
                <div className="flex justify-between mt-6">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={step === 0}
                  >
                    Back
                  </Button>
                  <Button type="submit">
                    {step === 1 ? "Place Order" : "Next"}
                  </Button>
                </div>
              </Card>
            </div>
            <Card className="flex justify-center items-center">Summary</Card>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default Checkout;
