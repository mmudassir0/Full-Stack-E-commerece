import React, { useState } from "react";
import { Input } from "../ui/input";
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { Path, UseFormReturn } from "react-hook-form";
import { TypeOf, z } from "zod";
import { GenericZodSchema } from "./form-wrapper";

type PasswordFieldProps<T extends GenericZodSchema> = {
  name: Path<TypeOf<T>>;
  placeholder?: string;
  type?: string;
  form: UseFormReturn<z.infer<T>>;
};

const PasswordField = <T extends GenericZodSchema>({
  name,
  placeholder,
  form,
}: PasswordFieldProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className=" relative">
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                placeholder={placeholder}
                {...field}
                type={showPassword ? "text" : "password"}
                value={field.value || ""}
              />
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />
      <div
        className="absolute right-3 top-2 justify-center cursor-pointer"
        onClick={() => {
          setShowPassword(!showPassword);
        }}
      >
        {showPassword ? (
          <AiOutlineEyeInvisible className="w-5 h-5" />
        ) : (
          <AiOutlineEye className="w-5 h-5" />
        )}
      </div>
    </div>
  );
};

export default PasswordField;
