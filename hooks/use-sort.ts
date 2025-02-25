import { SortOption } from "@/lib/sort-util";
import React from "react";

export const useSort = () => {
  const [sortBy, setSortBy] = React.useState<SortOption>("featured");

  const updateSort = (value: SortOption) => {
    setSortBy(value);
  };
  return {
    sortBy,
    updateSort,
  };
};
