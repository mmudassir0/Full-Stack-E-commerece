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
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";

type FormInputProps<T extends GenericZodSchema> = {
  name: Path<TypeOf<T>>;
  placeholder?: string;
  type?: string;
  defaultValue?: string;
  form: UseFormReturn<z.infer<T>>;
  className?: string;
  label?: string;
  Icon?: React.ElementType;
};

const CalanderField = <T extends GenericZodSchema>({
  name,
  form,
  label,
}: FormInputProps<T>) => {
  return (
    <div>
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem className="flex flex-col">
            {label ? (
              <FormLabel className="font-bold text-base">{label}</FormLabel>
            ) : (
              ""
            )}
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "h-11 pl-3 text-left font-normal md:text-lg text-muted-foreground",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default CalanderField;

{
  /* <FormItem className="flex flex-col">
<Label>Date of birth</Label>
<Popover>
  <PopoverTrigger asChild>
    <FormControl>
      <Button
        variant={"outline"}
        className={cn(
          "w-[240px] pl-3 text-left font-normal",
          !field.value && "text-muted-foreground"
        )}
      >
        {field.value ? (
          format(field.value, "PPP")
        ) : (
          <span>Pick a date</span>
        )}
        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
      </Button>
    </FormControl>
  </PopoverTrigger>
  <PopoverContent className="w-auto p-0" align="start">
    <Calendar
      mode="single"
      selected={field.value}
      onSelect={field.onChange}
      disabled={(date) =>
        date > new Date() || date < new Date("1900-01-01")
      }
      initialFocus
    />
  </PopoverContent>
</Popover>

<FormMessage />
</FormItem> */
}
