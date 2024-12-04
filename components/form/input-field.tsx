import React from "react";
import { Input } from "../ui/input";
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Path, UseFormReturn } from "react-hook-form";
import { TypeOf, z } from "zod";
import { GenericZodSchema } from "./form-wrapper";

type FormInputProps<T extends GenericZodSchema> = {
  name: Path<TypeOf<T>>;
  placeholder?: string;
  type?: string;
  defaultValue?: string;
  form: UseFormReturn<z.infer<T>>;
};

const TextField = <T extends GenericZodSchema>({
  name,
  placeholder,
  type = "text",
  form,
}: FormInputProps<T>) => {
  return (
    <div>
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                placeholder={placeholder}
                {...field}
                type={type}
                value={field.value || ""}
              />
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default TextField;
