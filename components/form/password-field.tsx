import React, { useState } from "react";
import { Input } from "../ui/input";
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { Path, UseFormReturn } from "react-hook-form";
import { TypeOf, z } from "zod";
import { GenericZodSchema } from "./form-wrapper";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";

type PasswordFieldProps<T extends GenericZodSchema> = {
  name: Path<TypeOf<T>>;
  placeholder?: string;
  type?: string;
  form: UseFormReturn<z.infer<T>>;
  className?: string;
  Icon?: React.ElementType;
  label?: string;
};

const PasswordField = <T extends GenericZodSchema>({
  name,
  placeholder,
  form,
  className,
  Icon,
  label,
}: PasswordFieldProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className=" ">
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            {label ? (
              <Label className="font-bold text-base">{label}</Label>
            ) : (
              ""
            )}
            <FormControl>
              <div className="relative flex items-center">
                {Icon && (
                  <Icon className="absolute left-4 w-6 h-6 text-gray-400" />
                )}
                <Input
                  className={cn(
                    `{ h-11 md:text-lg focus:border-transparent transition-all duration-300 ${
                      Icon && "pl-12 "
                    }}`,
                    className
                  )}
                  placeholder={placeholder}
                  {...field}
                  type={showPassword ? "text" : "password"}
                  value={field.value || ""}
                />
                <div
                  className="absolute right-3 top-3 justify-center items-center text-white text-xl cursor-pointer"
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible className="w-6 h-6 text-gray-400" />
                  ) : (
                    <AiOutlineEye className="w-6 h-6 text-gray-400 " />
                  )}
                </div>
              </div>
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default PasswordField;
