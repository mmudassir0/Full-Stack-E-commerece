import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SortOption } from "@/lib/sort-util";

type ProductSortProps = {
  value: SortOption;
  onChange: (value: SortOption) => void;
};

const ProductSort = ({ value, onChange }: ProductSortProps) => {
  return (
    <Select defaultValue="featured" value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[160px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="featured">Featured</SelectItem>
        <SelectItem value="newest">Newest Arrivals</SelectItem>
        <SelectItem value="price-asc">Price: Low to High</SelectItem>
        <SelectItem value="price-desc">Price: High to Low</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default ProductSort;
