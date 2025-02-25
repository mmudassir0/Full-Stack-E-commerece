"use client";
import { Filter as FIlterIcon } from "lucide-react";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import FilterSidebar from "./filter-sidebar";
import { Filter } from "@/hooks/use-filter";

type MobileFilterProps = {
  filters: Filter;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFilterChange: (key: keyof Filter, value: any) => void;
};

const MobileFilter = ({ filters, onFilterChange }: MobileFilterProps) => {
  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger className="p-2 border-2 rounded-md">
          <FIlterIcon className="h-4 w-4" />
        </SheetTrigger>
        <SheetContent side={"left"} className="w-full sm:w-[340px]">
          <SheetHeader>
            <SheetTitle>Products Filter</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            <FilterSidebar filters={filters} onFilterChange={onFilterChange} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileFilter;
