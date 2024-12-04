"use client";

import { loginUser } from "@/actions/auth";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (formData: FormData) => {
    const result = await loginUser(formData);

    if (result?.errors) {
      setErrors(result.errors);
    }

    if (result?.message) {
      setMessage(result.message);
    }
  };

  const handleSocialLogin = async (provider: "google" | "github") => {
    await signIn(provider, { callbackUrl: "/dashboard" });
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      {message && <p className="text-red-500 mb-4">{message}</p>}

      <form action={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full p-2 border rounded"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            className="w-full p-2 border rounded"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password[0]}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>

      <div className="mt-4 space-y-2">
        <button
          onClick={() => handleSocialLogin("google")}
          className="w-full p-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Login with Google
        </button>
        <button
          onClick={() => handleSocialLogin("github")}
          className="w-full p-2 bg-gray-800 text-white rounded hover:bg-gray-900"
        >
          Login with GitHub
        </button>
      </div>
    </div>
  );
}
