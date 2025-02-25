"use client";
import React from "react";

export type Filter = {
  price: [number, number];
  categories: string[];
  colors: string[];
  sizes: string[];
};

const initialFilter: Filter = {
  price: [0, 200],
  sizes: [],
  colors: [],
  categories: [],
};

export const useFilter = () => {
  const [filters, setFilters] = React.useState<Filter>(initialFilter);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateFilter = (key: keyof Filter, value: any) => {
    setFilters(() => ({
      ...filters,
      [key]: value,
    }));
  };
  return {
    filters,
    updateFilter,
  };
};
