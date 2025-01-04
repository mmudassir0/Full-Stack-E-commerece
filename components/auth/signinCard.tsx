"use client";
import React from "react";

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

const SignInCard = () => {
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
    console.log(data, "data");
    const result = await loginUser(data);
    if (result.success) {
      router.push("/dashboard");
    }
    if (result?.message) {
      toast(result?.message, { position: "top-right" });
    }
  }

  return (
    <CardWrapper
      headerlabel="Welcome Back"
      href="/signup"
      label="Don't have an account?"
      linkLabel="SignUp"
    >
      <FormWrapper<typeof SignInSchema>
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
      </FormWrapper>
    </CardWrapper>
  );
};
export default SignInCard;
