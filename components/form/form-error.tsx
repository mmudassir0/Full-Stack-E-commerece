import React from "react";

interface FormErrorProps {
  error?: string | undefined;
}

const FormError = ({ error }: FormErrorProps) => {
  if (!error) {
    return null;
  }
  return <div className="mt-2 text-sm text-rose-500">{error}</div>;
};

export default FormError;
