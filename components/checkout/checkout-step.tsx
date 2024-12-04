import { CheckCircle, CreditCard, Package, Truck } from "lucide-react";
import React from "react";

type CheckoutStepsProps = {
  currentStep: number;
};
const CheckoutStep = ({ currentStep }: CheckoutStepsProps) => {
  const steps = [
    { id: "shipping", title: "Shipping", icon: Truck },
    { id: "payment", title: "Payment", icon: CreditCard },
    { id: "summary", title: "Summary", icon: Package },
  ];

  return (
    <div className="">
      <div className="">
        <div className="relative flex justify-bewteen justify-center">
          {steps.map((step, index) => {
            return (
              <div key={step.id} className={`flex items-center`}>
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    index <= currentStep
                      ? "bg-primary text-primary-foreground"
                      : "bg-gray-300 text-gray-500"
                  }`}
                >
                  {index < currentStep ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <step.icon className="w-6 h-6" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-14 md:w-40  h-1 ${
                      index < currentStep ? "bg-primary" : "bg-gray-300"
                    }`}
                  ></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CheckoutStep;
