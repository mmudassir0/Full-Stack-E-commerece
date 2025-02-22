import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Path, UseFormReturn } from "react-hook-form";
import { TypeOf, z } from "zod";
import { GenericZodSchema } from "./form-wrapper";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";

type FormInputProps<T extends GenericZodSchema> = {
  name: Path<TypeOf<T>>;
  placeholder?: string;
  defaultValue?: string;
  form: UseFormReturn<z.infer<T>>;
  className?: string;
  label?: string;
  Icon?: React.ElementType;
  options: { value: string; label: string }[];
};

const SelectField = <T extends GenericZodSchema>({
  name,
  placeholder,
  form,
  className,
  options,
  label,
}: FormInputProps<T>) => {
  return (
    <div>
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            {label && <FormLabel className="font-bold">{label}</FormLabel>}
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger
                  className={cn("h-11 md:text-lg text-gray-600", className)}
                >
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="">
                {options.map((option) => {
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default SelectField;

{
  /* <FormControl>
    <>
      {label ? (
        <Label className="font-bold text-base">{label}</Label>
      ) : (
        ""
      )}
      <div className="relative flex items-center">
        {Icon && (
          <Icon className="absolute left-4 w-6 h-6 text-gray-300" />
        )}
        <Input
          className={cn(
            `h-11 md:text-lg  focus:border-transparent transition-all duration-300 ${
              Icon && "pl-12"
            }`,
            className
          )}
          placeholder={placeholder}
          {...field}
          type={type}
          value={field.value || ""}
        />
      </div>
    </>
  </FormControl> */
}
