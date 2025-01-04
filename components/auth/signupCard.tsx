"use client";
import React from "react";

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

const SignUpCard = () => {
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
    const result = await registerUser(data);
    if (result?.redirectTo) {
      router.push(result.redirectTo);
    }
    if (result?.message) {
      toast(result?.message, { position: "top-right" });
    }
  }

  return (
    <CardWrapper
      headerlabel="SignUp"
      href="/signin"
      label="Already have an account?"
      linkLabel="SignIn"
    >
      <FormWrapper<typeof SignUpSchema>
        form={form}
        onSubmit={onSubmit}
        className="space-y-4"
      >
        <TextField form={form} name="name" placeholder="Name" />
        <TextField form={form} name="email" placeholder="Email" />
        <PasswordField form={form} name="password" placeholder="Password" />
        <CheckboxField
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

        <Button type="submit" className="w-full">
          SignUp
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
export default SignUpCard;
