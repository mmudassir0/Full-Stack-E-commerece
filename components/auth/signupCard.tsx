"use client";
import React, { useTransition } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextField from "../form/input-field";
import FormWrapper from "../form/form-wrapper";
import { Button } from "../ui/button";
import CardWrapper from "./card-wrapper";
import { SignUpFormValues, SignUpSchema } from "@/prisma/schemas";
import PasswordField from "../form/password-field";
import { registerUser } from "@/actions/auth";
import { toast } from "sonner";
import CheckboxField from "../form/checkbox-field";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Mail, User } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Social from "./social";
import BackButton from "./back-button";

const SignUpCard = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      termsAccepted: false,
    },
  });

  async function onSubmit(data: SignUpFormValues) {
    startTransition(async () => {
      const result = await registerUser(data);
      if (result?.redirectTo) {
        router.push(result.redirectTo);
      }
      if (result?.message) {
        toast(result?.message, { position: "top-right" });
      }
    });
  }

  return (
    <CardWrapper
      headerlabel="Sign Up"
      headeerDescription=" Create your account and get started!"
      headerIcon={<User className="w-10 h-10 text-white" />}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="space-y-6"
        >
          <FormWrapper<typeof SignUpSchema>
            form={form}
            onSubmit={onSubmit}
            className="space-y-4"
          >
            <TextField
              form={form}
              name="name"
              placeholder="Enter your name"
              Icon={User}
              className="bg-white/5 border-white/10 text-white placeholder:text-blue-200 focus:ring-2 focus:ring-purple-500"
            />
            <TextField
              form={form}
              name="email"
              placeholder="Enter your email"
              Icon={Mail}
              className="bg-white/5 border-white/10 text-white placeholder:text-blue-200 focus:ring-2 focus:ring-purple-500"
            />
            <PasswordField
              form={form}
              name="password"
              placeholder="Create a password"
              Icon={Lock}
              className="bg-white/5 border-white/10 text-white placeholder:text-blue-200 focus:ring-2 focus:ring-purple-500"
            />
            <CheckboxField
              className="focus:ring-purple-100 data-[state=checked]:bg-white/5"
              name="termsAccepted"
              label={
                <>
                  I agree to the{" "}
                  <a href="/terms" className="underline hover:text-primary">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" className="underline hover:text-primary">
                    Privacy Policy
                  </a>
                  .
                </>
              }
              form={form}
            />

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
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
                    <span className="inline-block w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Signing Up...</span>
                  </motion.div>
                ) : (
                  <span className="flex items-center justify-center">
                    Sign Up
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                )}
              </Button>
            </motion.div>
          </FormWrapper>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10"></span>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2  text-blue-200">Or continue with</span>
            </div>
          </div>

          <Social />
          <BackButton
            href="/signin"
            label=" Already have an account?"
            linkLabel="Sign in"
          />
        </motion.div>
      </AnimatePresence>
    </CardWrapper>
  );
};
export default SignUpCard;
