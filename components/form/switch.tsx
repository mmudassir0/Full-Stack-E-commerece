import React from "react";
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Path, UseFormReturn } from "react-hook-form";
import { TypeOf, z } from "zod";
import { GenericZodSchema } from "./form-wrapper";
import { Switch } from "../ui/switch";

type FormInputProps<T extends GenericZodSchema> = {
  name: Path<TypeOf<T>>;
  placeholder?: string;
  type?: string;
  defaultValue?: string;
  form: UseFormReturn<z.infer<T>>;
  className?: string;
  label?: string;
  Icon?: React.ElementType;
  disabled?: boolean;
};

const SwitchField = <T extends GenericZodSchema>({
  name,
  form,
  onChange,
}: FormInputProps<T>) => {
  return (
    <div>
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={(data) => {
                  field.onChange(data);
                }}
              />
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default SwitchField;
