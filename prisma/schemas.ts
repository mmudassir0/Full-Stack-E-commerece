import { z } from "zod";

// Constants for validation rules
const PHONE_REGEX = /^\+?[1-9]\d{1,14}$/; // International phone number format
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 50;
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 32;
const BIO_MAX_LENGTH = 500;

// Base schemas for reuse
const nameSchema = z.object({
  name: z
    .string({ required_error: " name is required" })
    .min(1, "Name is required")
    .min(
      NAME_MIN_LENGTH,
      ` name must be at least ${NAME_MIN_LENGTH} characters`
    )
    .max(
      NAME_MAX_LENGTH,
      ` name must be less than ${NAME_MAX_LENGTH} characters`
    )
    .trim()
    .regex(
      /^[a-zA-Z\s-']+$/,
      " name can only contain letters, spaces, hyphens, and apostrophes"
    ),
});

const phoneSchema = z.object({
  phone: z
    .string()
    .regex(
      PHONE_REGEX,
      "Invalid phone number format. Please use international format (e.g., +1234567890)"
    )
    .optional()
    .nullable(),
});

const emailSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email format")
    .toLowerCase()
    .trim(),
});

const passwordValidation = z
  .string({ required_error: "Password is required" })
  .min(
    PASSWORD_MIN_LENGTH,
    `Password must be at least ${PASSWORD_MIN_LENGTH} characters`
  )
  .max(
    PASSWORD_MAX_LENGTH,
    `Password must be less than ${PASSWORD_MAX_LENGTH} characters`
  )
  .regex(
    PASSWORD_REGEX,
    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
  );

const passwordSchema = z.object({
  password: passwordValidation,
});

// Main schemas
export const SignUpSchema = z
  .object({})
  .merge(nameSchema)
  .merge(emailSchema)
  .merge(passwordSchema)
  .extend({
    termsAccepted: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  });

export const SignInSchema = z
  .object({})
  .merge(emailSchema)
  .merge(
    z.object({
      password: z
        .string({ required_error: "Password is required" })
        .min(1, "Password is required"),
      rememberMe: z.boolean().optional(),
    })
  );

export const UpdateProfileSchema = z
  .object({})
  .merge(
    nameSchema.partial() // Makes all fields optional
  )
  .merge(
    emailSchema.partial() // Makes all fields optional
  )
  .merge(phoneSchema)
  .extend({
    bio: z
      .string()
      .max(BIO_MAX_LENGTH, `Bio must be less than ${BIO_MAX_LENGTH} characters`)
      .optional()
      .nullable(),
    // timezone: z
    //   .string()
    //   .regex(/^[A-Za-z/_+-]+$/, "Invalid timezone format")
    //   .optional(),
    // language: z
    //   .string()
    //   .regex(/^[a-z]{2}(-[A-Z]{2})?$/, "Invalid language format (e.g., en-US)")
    //   .optional(),
    gender: z.string().optional().nullable(),
    dob: z
      .date()
      .optional()
      .nullable()
      .refine(
        (date) => {
          if (!date) return true;
          const birthDate = new Date(date);
          const today = new Date();
          const age = today.getFullYear() - birthDate.getFullYear();
          return age >= 13;
        },
        { message: "User must be at least 13 years old" }
      ),
    profileImageUrl: z.string().url("Invalid URL format").optional().nullable(),
    // preferences: z.record(z.unknown()).optional().nullable(),
  });

export const UpdateNewPasswordSchema = z
  .object({
    currentPassword: z
      .string({ required_error: "Pasword is required" })
      .min(1, "Password is required"),
    newPassword: passwordValidation,
    confirmPassword: passwordValidation,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "passwords must match",
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    path: ["newPassword"],
    message: "New password must not be the same as the current password",
  });
export const ForgetPasswordSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email format")
    .toLowerCase()
    .trim(),
});

export const ResetPasswordSchema = z
  .object({
    // token: z.string().min(1, "Token is required"),
    password: z
      .string({ required_error: "Pasword is required" })
      .min(1, "Password is Required")
      .min(8, "Password must be at least 8 characters")
      .max(100)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    confirmPassword: z.string({ required_error: "Pasword is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Type exports
export type SignUpFormValues = z.infer<typeof SignUpSchema>;
export type SignInFormValues = z.infer<typeof SignInSchema>;
export type ForgetPasswordValue = z.infer<typeof ForgetPasswordSchema>;
export type ResetPasswordValue = z.infer<typeof ResetPasswordSchema>;

export type UpdateProfileValues = z.infer<typeof UpdateProfileSchema>;
export type UpdateNewPasswordValues = z.infer<typeof UpdateNewPasswordSchema>;

// Error formatting helper
export const formatZodError = (error: z.ZodError) => {
  return Object.fromEntries(
    error.errors.map((err) => [err.path.join("."), err.message])
  );
};
