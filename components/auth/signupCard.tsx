"use client";
import React from "react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import TextField from "../form/input-field";
import FormWrapper from "../form/form-wrapper";
import { Button } from "../ui/button";
import CardWrapper from "./card-wrapper";
import { SignUpSchema } from "@/prisma/schemas";
import PasswordField from "../form/password-field";
import { registerUser } from "@/actions/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export type SignUpFormValues = z.infer<typeof SignUpSchema>;

const SignUpCard = () => {
  const router = useRouter();
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
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
        <TextField form={form} name="name" placeholder="Enter name" />
        <TextField form={form} name="email" placeholder="Enter email" />
        <PasswordField
          form={form}
          name="password"
          placeholder="Enter Password"
        />
        <Button type="submit" className="w-full">
          SignUp
        </Button>
      </FormWrapper>
    </CardWrapper>
  );
};
export default SignUpCard;
