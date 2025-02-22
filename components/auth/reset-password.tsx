"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import FormWrapper from "@/components/form/form-wrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { resetPassword } from "@/actions/reset-password";
import { Lock, ArrowRight, CheckCircle, XCircle } from "lucide-react";
import PasswordField from "../form/password-field";
import CardWrapper from "./card-wrapper";
import { ResetPasswordSchema, ResetPasswordValue } from "@/prisma/schemas";
import { useSearchParams } from "next/navigation";

const ResetPassword = () => {
  const [status, setStatus] = useState<{ success?: boolean; message?: string }>(
    {}
  );
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isPending, setIsPending] = useState(false);
  const form = useForm<ResetPasswordValue>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  console.log(isPending, "isPending");
  async function onSubmit(data: ResetPasswordValue) {
    setIsPending(true);

    const result = await resetPassword(data, token as string);
    setStatus(result);
    setIsPending(false);
  }
  useEffect(() => {
    if (!token) {
      setStatus({
        success: false,
        message: "Token required for password reset",
      });
    }
  }, [token]);

  return (
    <CardWrapper
      headerlabel="Reset Password"
      headerIcon={<Lock className="w-10 h-10 text-white" />}
      headeerDescription="Enter your new password below."
    >
      <AnimatePresence mode="wait">
        <div className="space-y-8">
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="space-y-6"
          >
            <FormWrapper form={form} onSubmit={onSubmit}>
              <div className="space-y-4">
                <PasswordField
                  form={form}
                  name="password"
                  placeholder="Enter your new password"
                  Icon={Lock}
                />
                <PasswordField
                  form={form}
                  name="confirmPassword"
                  placeholder="Confirm your new password"
                  Icon={Lock}
                />
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden relative"
                    disabled={isPending}
                  >
                    <span className="absolute right-0 h-full aspect-square bg-white/10 skew-x-12 -translate-x-1/2 group-hover:translate-x-0 transition-transform duration-300"></span>
                    {isPending ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-center space-x-2"
                      >
                        <span className="inline-block w-5 h-5 border-2  border-white/20 border-t-white rounded-full animate-spin" />
                        <span className="text-xl font-bold">Sending...</span>
                      </motion.div>
                    ) : (
                      <span className="flex items-center justify-center text-xl font-bold">
                        Reset Password
                        <ArrowRight className="ml-2 w-5 h-5 font-bold group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                    )}
                  </Button>
                </motion.div>
              </div>
            </FormWrapper>
          </motion.div>
          {status.message && (
            <motion.div
              key="notification"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className="p-6 rounded-xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-md shadow-xl"
            >
              <div className="flex items-center space-x-4">
                {status.success ? (
                  <CheckCircle className="w-8 h-8 text-green-400" />
                ) : (
                  <XCircle className="w-8 h-8 text-red-400" />
                )}
                <p className="text-white text-lg font-medium">
                  {status.message}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </AnimatePresence>
    </CardWrapper>
  );
};

export default ResetPassword;
