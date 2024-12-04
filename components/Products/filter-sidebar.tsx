"use client";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Filter } from "@/hooks/use-filter";

type FilterSidebarProps = {
  filters: Filter;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFilterChange: (key: keyof Filter, value: any) => void;
};

const FilterSidebar = ({ filters, onFilterChange }: FilterSidebarProps) => {
  const categories = ["Men", "Women", "Kids", "Accessories"];
  const colors = ["Black", "White", "Blue", "Red", "Green"];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  return (
    <div className="space-y-3 mr-3">
      <h3 className="text-xl font-bold"> Filters</h3>
      <div className="space-y-2 mt-5">
        <h3 className="font-semibold mb-4">Price Range</h3>
        <Slider
          defaultValue={[filters.price[0], filters.price[1]]}
          max={200}
          min={0}
          step={1}
          onValueChange={(value) => onFilterChange("price", value)}
        />
        <div className="flex justify-between items-center">
          <span>{filters.price[0]}</span>
          <span>{filters.price[1]}</span>
        </div>
      </div>
      <div className="mt-10">
        <Accordion type="multiple" className="w-full">
          <AccordionItem value={"categories"}>
            <AccordionTrigger className="text-lg">Categories</AccordionTrigger>
            <AccordionContent>
              {categories.map((category) => {
                return (
                  <div
                    key={category}
                    className="flex items-center space-x-2 py-1"
                  >
                    <Checkbox
                      id={category}
                      checked={filters.categories.includes(category)}
                      onCheckedChange={(checked) => {
                        const newCategories = checked
                          ? [...filters.categories, category]
                          : filters.categories.filter((c) => c !== category);
                        onFilterChange("categories", newCategories);
                      }}
                    />
                    <label
                      htmlFor={category}
                      className="tex-sm font-medium leading-none "
                    >
                      {category}
                    </label>
                  </div>
                );
              })}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value={"colors"}>
            <AccordionTrigger className="text-lg">Colors</AccordionTrigger>
            <AccordionContent>
              {colors.map((color) => {
                return (
                  <div key={color} className="flex items-center space-x-2 py-1">
                    <Checkbox
                      id={color}
                      checked={filters.colors.includes(color)}
                      onCheckedChange={(checked) => {
                        const newColors = checked
                          ? [...filters.colors, color]
                          : filters.colors.filter((c) => c !== color);
                        onFilterChange("colors", newColors);
                      }}
                    />
                    <label
                      htmlFor={color}
                      className="tex-sm font-medium leading-none "
                    >
                      {color}
                    </label>
                  </div>
                );
              })}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value={"sizes"}>
            <AccordionTrigger className="text-lg">Sizes</AccordionTrigger>
            <AccordionContent>
              {sizes.map((size) => {
                return (
                  <div key={size} className="flex items-center space-x-2 py-1">
                    <Checkbox
                      id={size}
                      checked={filters.sizes.includes(size)}
                      onCheckedChange={(checked) => {
                        const newsizes = checked
                          ? [...filters.sizes, size]
                          : filters.sizes.filter((c) => c !== size);
                        onFilterChange("sizes", newsizes);
                      }}
                    />
                    <label
                      htmlFor={size}
                      className="tex-sm font-medium leading-none "
                    >
                      {size}
                    </label>
                  </div>
                );
              })}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default FilterSidebar;
