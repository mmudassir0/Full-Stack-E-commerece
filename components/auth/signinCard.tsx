"use client";
import React from "react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import TextField from "../form/input-field";
import FormWrapper from "../form/form-wrapper";
import { Button } from "../ui/button";
import CardWrapper from "./card-wrapper";
import { SignInSchema } from "@/prisma/schemas";
import PasswordField from "../form/password-field";
import { loginUser } from "@/actions/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export type SignInFormValues = z.infer<typeof SignInSchema>;

const SignInCard = () => {
  const router = useRouter();
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: SignInFormValues) {
    const result = await loginUser(data);
    if (result.redirectTo) {
      router.push(result.redirectTo);
    }
    if (result?.message) {
      toast(result?.message, { position: "top-right" });
    }
  }

  return (
    <CardWrapper
      headerlabel="SignIn"
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
        <Button type="submit" className="w-full">
          SignIn
        </Button>
      </FormWrapper>
    </CardWrapper>
  );
};
export default SignInCard;
