import { Input } from "@/components/ui/input";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useFormContext } from "react-hook-form";

export function ShippingForm() {
  const { control } = useFormContext();
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="firstname"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">First Name</FormLabel>
              <FormControl>
                <Input placeholder="Mudassir" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="lastname"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Abbas" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Email</FormLabel>
              <FormControl>
                <Input placeholder="mudassir.abbas@store.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Phone</FormLabel>
              <FormControl>
                <Input placeholder="+1234567890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-bold">Address</FormLabel>
            <FormControl>
              <Input placeholder="123 Main Street" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">City</FormLabel>
              <FormControl>
                <Input placeholder="Lahore" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">State</FormLabel>
              <FormControl>
                <Input placeholder="Pakistan" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="zipcode"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Zip Code</FormLabel>
              <FormControl>
                <Input placeholder="54000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
