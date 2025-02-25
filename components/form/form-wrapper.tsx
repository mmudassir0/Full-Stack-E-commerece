import React from "react";
import { Form } from "../ui/form";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GenericZodSchema = z.ZodType<any, any>;

type FormWrapperProps<T extends GenericZodSchema> = {
  children: React.ReactNode;
  onSubmit: (data: z.infer<T>) => void;
  form: UseFormReturn<z.infer<T>>;
  className?: string;
};

const FormWrapper = <T extends GenericZodSchema>({
  children,
  form,
  onSubmit,
  className,
}: FormWrapperProps<T>) => {
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={`${className}`}>
          {children}
        </form>
      </Form>
    </div>
  );
};

export default FormWrapper;
