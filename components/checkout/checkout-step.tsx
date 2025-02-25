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
    <div className="w-full">
      <div className=" flex justify-bewteen justify-center">
        {steps.map((step, index) => {
          return (
            <div key={step.id}>
              <div className={`flex items-center `}>
                <div className="flex flex-col justify-start items-start mx-2 ">
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
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-14 md:w-60  h-1  ${
                      index < currentStep ? "bg-primary" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
              <div className="flex justify-between  items-center text-center mt-3">
                {step.title}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CheckoutStep;
