import { z } from "zod";

export const shippingSchema = z.object({
  firstname: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" }),
  lastname: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string(),
  // .regex(/^\+?[1-9]\d{1,14}$/, { message: "Invalid phone number" }),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters" }),
  city: z.string().min(2, { message: "City must be at least 2 characters" }),
  state: z.string().min(2, { message: "State must be at least 2 characters" }),
  zipcode: z
    .string()
    .regex(/^\d{5}(-\d{4})?$/, { message: "Invalid zip code" }),
});

const validateCardNumber = (cardNumber: string) => {
  const cleanedNumber = cardNumber.replace(/[\s-]/g, "");

  if (!/^\d+$/.test(cleanedNumber)) {
    return false;
  }
  let sum = 0;
  let isEvenIndex = false;

  for (let i = cleanedNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanedNumber.charAt(i), 10);

    if (isEvenIndex) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEvenIndex = !isEvenIndex;
  }

  return sum % 10 === 0;
};

// Payment form validation schema
export const paymentSchema = z.object({
  cardNumber: z
    .string()
    .min(12, { message: "Card number must be at least 12 digits" })
    .max(19, { message: "Card number cannot exceed 19 digits" })
    .refine(validateCardNumber, { message: "Invalid card number" })
    .transform((value) => value.replace(/[\s-]/g, "")), // Remove spaces and hyphens

  cardName: z
    .string()
    .min(2, { message: "Name on card must be at least 2 characters" })
    .max(50, { message: "Name on card cannot exceed 50 characters" })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Name can only contain letters and spaces",
    }),

  expiry: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, {
      message: "Invalid expiration date (MM/YY format)",
    })
    .refine(
      (value) => {
        const [month, year] = value.split("/").map(Number);
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear() % 100;

        // Check if the card is not expired
        return (
          year > currentYear || (year === currentYear && month >= currentMonth)
        );
      },
      { message: "Card has expired" }
    ),

  cvv: z.string().regex(/^\d{3,4}$/, { message: "CVV must be 3 or 4 digits" }),
});
