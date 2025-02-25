import { Input } from "@/components/ui/input";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useFormContext } from "react-hook-form";
import { CreditCard } from "lucide-react";

export function PaymentForm() {
  const { control } = useFormContext();
  return (
    <div className="space-y-8">
      <FormField
        control={control}
        name="cardNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-bold">Card Number</FormLabel>
            <FormControl>
              <div className="relative">
                <Input placeholder="1234 5678 9012 3456" {...field} />
                <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="cardName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-bold">Name on Card</FormLabel>
            <FormControl>
              <Input placeholder="Mudassir Abbas" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="expiry"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Expiration Date</FormLabel>
              <FormControl>
                <Input placeholder="MM/YY" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="cvv"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">CVV</FormLabel>
              <FormControl>
                <Input placeholder="123" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
