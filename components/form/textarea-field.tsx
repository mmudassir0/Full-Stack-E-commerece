import React from "react";
import { Input } from "../ui/input";
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Path, UseFormReturn } from "react-hook-form";
import { TypeOf, z } from "zod";
import { GenericZodSchema } from "./form-wrapper";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

type FormInputProps<T extends GenericZodSchema> = {
  name: Path<TypeOf<T>>;
  placeholder?: string;
  form: UseFormReturn<z.infer<T>>;
  className?: string;
  label?: string;
};

const TextareaField = <T extends GenericZodSchema>({
  name,
  placeholder,
  form,
  label,
  className,
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
                <Textarea
                  placeholder={placeholder}
                  className={cn("resize-none", className)}
                  {...field}
                />
              </>
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default TextareaField;
