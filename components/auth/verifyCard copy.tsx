"use client";

import React, { useTransition, useRef, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import FormWrapper from "../form/form-wrapper";
import { Button } from "../ui/button";
import CardWrapper from "./card-wrapper";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ArrowRight, Shield, RefreshCcw, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "../ui/input";
import { Form } from "../ui/form";

const RESEND_TIME = 30; // Resend timeout in seconds

const VerifySchema = z.object({
  code: z.array(z.string()).length(6, "Please enter all 6 digits"),
});

type VerifyFormValues = z.infer<typeof VerifySchema>;

const VerifyCard = () => {
  const [isPending, startTransition] = useTransition();
  const [resendTimeout, setResendTimeout] = useState(0);
  const router = useRouter();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isShaking, setIsShaking] = useState(false);

  const form = useForm<VerifyFormValues>({
    resolver: zodResolver(VerifySchema),
    defaultValues: {
      code: ["", "", "", "", "", ""],
    },
  });

  useEffect(() => {
    // Auto-focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendTimeout > 0) {
      const timer = setTimeout(
        () => setResendTimeout((prev) => prev - 1),
        1000
      );
      return () => clearTimeout(timer);
    }
  }, [resendTimeout]);

  async function onSubmit(data: VerifyFormValues) {
    startTransition(async () => {
      try {
        const verificationCode = data.code.join("");
        // Replace with actual verification API call
        // const result = await verify2FA(verificationCode);

        // Temporary mock response - simulate failure for demo
        const result = { success: false, message: "Invalid code" };

        if (result.success) {
          toast.success("Successfully verified!");
          router.push("/dashboard");
          router.refresh();
        } else {
          setIsShaking(true);
          setTimeout(() => setIsShaking(false), 500);
          toast.error("Invalid verification code");
          form.setValue("code", ["", "", "", "", "", ""]);
          inputRefs.current[0]?.focus();
        }
      } catch (error) {
        toast.error("Verification failed");
      }
    });
  }

  const handleResendCode = async () => {
    try {
      // Replace with actual resend API call
      // await resendVerificationCode();
      toast.success("New code sent to your device");
      setResendTimeout(RESEND_TIME);
    } catch (error) {
      toast.error("Failed to resend code");
    }
  };

  const handleInputChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...form.getValues().code];
    newCode[index] = value;
    form.setValue("code", newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !form.getValues().code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (pastedData) {
      const newCode = Array(6).fill("");
      pastedData.split("").forEach((char, index) => {
        if (index < 6) newCode[index] = char;
      });
      form.setValue("code", newCode);
      if (pastedData.length === 6) {
        inputRefs.current[5]?.focus();
      } else {
        inputRefs.current[pastedData.length]?.focus();
      }
    }
  };

  return (
    <CardWrapper
      headerlabel="Two-Factor Authentication"
      headerIcon={<Shield className="w-10 h-10 text-white" />}
      headeerDescription="We've sent a 6-digit code to your device"
    >
      <AnimatePresence mode="wait">
        <div className="space-y-6">
          <FormWrapper form={form} onSubmit={onSubmit}>
            <div className="space-y-6">
              <Form {...form}>
                <motion.div
                  animate={
                    isShaking
                      ? {
                          x: [-10, 10, -10, 10, 0],
                          transition: { duration: 0.4 },
                        }
                      : {}
                  }
                  className="flex gap-2 justify-between mb-6"
                >
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <Input
                      key={index}
                      type="text"
                      maxLength={1}
                      className="w-14 h-14 text-center text-xl font-semibold rounded-xl border-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      value={form.watch().code[index]}
                      onChange={(e) => handleInputChange(e.target.value, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      onPaste={handlePaste}
                      ref={(el) => (inputRefs.current[index] = el)}
                      disabled={isPending}
                      autoComplete="one-time-code"
                    />
                  ))}
                </motion.div>
              </Form>

              <div className="space-y-3">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden relative"
                    disabled={
                      isPending || form.watch().code.some((digit) => !digit)
                    }
                  >
                    <span className="absolute right-0 h-full aspect-square bg-white/10 skew-x-12 -translate-x-1/2 group-hover:translate-x-0 transition-transform duration-300"></span>
                    {isPending ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-center space-x-2"
                      >
                        <span className="inline-block w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        <span className="text-lg font-bold">Verifying...</span>
                      </motion.div>
                    ) : (
                      <span className="flex items-center justify-center text-lg font-bold">
                        Verify Code
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                    )}
                  </Button>
                </motion.div>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full py-6 text-gray-600 hover:text-gray-900 bg-white"
                  onClick={handleResendCode}
                  disabled={resendTimeout > 0}
                >
                  {resendTimeout > 0 ? (
                    <span className="flex items-center justify-center text-sm">
                      <Clock className="w-4 h-4 mr-2" />
                      Resend code in {resendTimeout}s
                    </span>
                  ) : (
                    <span className="flex items-center justify-center text-sm">
                      <RefreshCcw className="w-4 h-4 mr-2" />
                      Resend code
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </FormWrapper>

          <div className="text-center text-sm text-gray-500">
            <p>
              Didn&apos;t receive the code? Check your spam folder or contact
              support.
            </p>
          </div>
        </div>
      </AnimatePresence>
    </CardWrapper>
  );
};

export default VerifyCard;
