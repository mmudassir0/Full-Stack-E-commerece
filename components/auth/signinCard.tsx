"use client";
import React, { useTransition } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextField from "../form/input-field";
import FormWrapper from "../form/form-wrapper";
import { Button } from "../ui/button";
import CardWrapper from "./card-wrapper";
import { SignInFormValues, SignInSchema } from "@/prisma/schemas";
import PasswordField from "../form/password-field";
import { loginUser } from "@/actions/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CheckboxField from "../form/checkbox-field";
import { ArrowRight, Lock, Mail, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Social from "./social";
import BackButton from "./back-button";

const SignInCard = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  });

  async function onSubmit(data: SignInFormValues) {
    startTransition(async () => {
      console.log(data, "data");
      const result = await loginUser(data);
      console.log(result, "result");
      if (result.success) {
        router.push("/dashboard");
        router.refresh();
      }
      if (result?.message) {
        toast(result?.message, { position: "top-right" });
      }
    });
  }

  return (
    <CardWrapper
      headerlabel="Sign In"
      headerIcon={<User className="w-10 h-10 text-white" />}
      headeerDescription="Welcome back! Please enter your details."
    >
      <AnimatePresence mode="wait">
        <div className="space-y-4">
          <FormWrapper form={form} onSubmit={onSubmit}>
            <div className="space-y-4">
              <TextField
                form={form}
                name="email"
                placeholder="Enter your email"
                Icon={Mail}
              />
              <PasswordField
                form={form}
                name="password"
                placeholder="Enter your password"
                Icon={Lock}
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckboxField
                    form={form}
                    label={<div>Remember me</div>}
                    name="rememberMe"
                    className="border-white/30 text-purple-500 focus:ring-purple-100 data-[state=checked]:bg-white/5 "
                  />
                </div>
                <Link
                  href="/forgot-password"
                  className="text-sm text-blue-300 hover:text-white transition-colors duration-200"
                >
                  Forgot password?
                </Link>
              </div>
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
                      <span className="inline-block w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <span className="text-lg font-bold">Signing In...</span>
                    </motion.div>
                  ) : (
                    <span className="flex items-center justify-center text-lg font-bold">
                      Sign In
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  )}
                </Button>
              </motion.div>
            </div>
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
            href="/signup"
            label="Don't have an account?"
            linkLabel="SignUp"
          />
        </div>
      </AnimatePresence>
    </CardWrapper>
  );
};
export default SignInCard;

{
  /* <FormWrapper<typeof SignInSchema>
        form={form}
        onSubmit={onSubmit}
        className="space-y-4"
      >
        <TextField form={form} name="email" placeholder="Enter email" />
        <PasswordField
          form={form}
          name="password"
          placeholder="Enter Password"
        />
        <div className="flex justify-between items-center">
          <CheckboxField
            form={form}
            label={<div>Remember me</div>}
            name="rememberMe"
          />
          <Link
            href="/forgot-password"
            className="text-sm text-blue-700 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>
        <Button type="submit" className="w-full">
          SignIn
        </Button>
        <div className="relative">
          <div className="absolute inset-0 flex items-center pt-3">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm pt-3">
            <span className="bg-white px-2 text-gray-500">
              Or continue with
            </span>
          </div>
        </div>
      </FormWrapper> */
}
