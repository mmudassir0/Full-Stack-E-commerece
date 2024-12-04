"use server";

import bcrypt from "bcryptjs";
import { signIn, signOut } from "@/lib/auth";
import { db } from "@/lib/db";
import { AuthError } from "next-auth";
import { SignUpSchema } from "@/prisma/schemas";
import { SignUpFormValues } from "@/components/auth/signupCard";
import { SignInFormValues } from "@/components/auth/signinCard";

export async function registerUser(formData: SignUpFormValues) {
  const validatedFields = SignUpSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Registration failed",
    };
  }

  const { name, email, password } = validatedFields.data;

  const existingUser = await db.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return {
      message: "User already exists",
      errors: { email: ["Email is already in use"] },
    };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  try {
    const res = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    if (res) {
      await loginUser({
        email: formData.email!,
        password: formData.password,
      });
      return {
        message: "Login successful",
        redirectTo: "/dashboard",
      };
    }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            message: "Invalid credentials",
            errors: {
              email: ["Incorrect email or password"],
            },
          };
        default:
          return {
            message: "Something went wrong",
            errors: {},
          };
      }
    }
    throw error;
  }
}

export async function loginUser(formData: SignInFormValues) {
  try {
    const result = await signIn("credentials", {
      ...formData,
      redirect: false,
    });
    if (result?.error) {
      return {
        message: "Invalid credentials",
        errors: {
          email: ["Incorrect email or password"],
        },
      };
    }
    return {
      message: "Login successful",
      redirectTo: "/dashboard",
    };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            message: "Invalid credentials",
            errors: {
              email: ["Incorrect email or password"],
            },
          };
        default:
          return {
            message: "Something went wrong",
            errors: {},
          };
      }
    }
    throw error;
  }
}

export async function logout() {
  await signOut({ redirectTo: "/signin" });
}
