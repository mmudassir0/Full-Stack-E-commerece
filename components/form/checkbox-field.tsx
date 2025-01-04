import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Path, UseFormReturn } from "react-hook-form";
import { TypeOf, z } from "zod";
import { GenericZodSchema } from "./form-wrapper";

type FormInputProps<T extends GenericZodSchema> = {
  name: Path<TypeOf<T>>;
  label: React.ReactNode;
  form: UseFormReturn<z.infer<T>>;
};

const CheckboxField = <T extends GenericZodSchema>({
  name,
  label,
  form,
}: FormInputProps<T>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-2">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              className="border-gray-300"
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>{label}</FormLabel>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
};

export default CheckboxField;
