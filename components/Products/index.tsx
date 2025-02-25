"use client";
import React from "react";
import ProductHeader from "./product-header";
import FilterSidebar from "./filter-sidebar";
import ProductView from "./product-view";
import ProductSort from "./product-sort";
import MobileFilter from "./mobile-filter";
import ProductCard from "./product-card";
import { useFilter } from "@/hooks/use-filter";
import { useSort } from "@/hooks/use-sort";
import { sortsProducts } from "@/lib/sort-util";
import { products } from "@/lib/products";

const Product = () => {
  const { filters, updateFilter } = useFilter();
  const { sortBy, updateSort } = useSort();

  const sortedProducted = sortsProducts(products, sortBy);

  const filterProducts = sortedProducted
    .filter(
      (product) =>
        +product.price >= filters.price[0] && +product.price <= filters.price[1]
    )
    .filter((product) => {
      if (
        filters.colors.length > 0 &&
        !product.colors.some((color) => filters.colors.includes(color))
      ) {
        return false;
      }
      return true;
    })
    .filter((product) => {
      if (
        filters.categories.length > 0 &&
        !product.categories.some((category) =>
          filters.categories.includes(category)
        )
      ) {
        return false;
      }
      return true;
    })
    .filter((product) => {
      if (
        filters.sizes.length > 0 &&
        !product.sizes.some((size) => filters.sizes.includes(size))
      ) {
        return false;
      }
      return true;
    });

  return (
    <div>
      <ProductHeader title="Men clothing" totalProduct={100} />
      <div className="flex flex-col md:flex-row gap-8 mt-8">
        <div className="hidden md:block w-64 border-r flex-shrink-0">
          <FilterSidebar filters={filters} onFilterChange={updateFilter} />
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap justify-center lg:justify-end gap-4 mb-4">
            <div className="flex items-center gap-x-3">
              <ProductView />
              <ProductSort value={sortBy} onChange={updateSort} />
              <MobileFilter filters={filters} onFilterChange={updateFilter} />
            </div>
          </div>

          <div className="grid lg:grid-cols-2 xl:grid-cols-3 justify-center items-center mx-auto gap-10 ">
            {filterProducts.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
