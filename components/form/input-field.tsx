import React from "react";
import { Input } from "../ui/input";
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Path, UseFormReturn } from "react-hook-form";
import { TypeOf, z } from "zod";
import { GenericZodSchema } from "./form-wrapper";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";

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

const TextField = <T extends GenericZodSchema>({
  name,
  placeholder,
  type = "text",
  form,
  className,
  Icon,
  label,
  disabled,
}: FormInputProps<T>) => {
  return (
    <div>
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <>
                {label ? (
                  <Label className="font-bold text-base">{label}</Label>
                ) : (
                  ""
                )}
                <div className="relative flex items-center">
                  {Icon && (
                    <Icon className="absolute left-4 w-6 h-6 text-gray-400" />
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
                    disabled={disabled}
                  />
                </div>
              </>
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default TextField;
