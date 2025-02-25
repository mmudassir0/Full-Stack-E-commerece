import React from "react";

type ProductHeaderProps = {
  title: string;
  totalProduct: number;
};

const ProductHeader = ({ title, totalProduct }: ProductHeaderProps) => {
  return (
    <div className="border-b bg-background py-4">
      <h2 className="text-4xl font-bold">{title}</h2>
      <p className="text-muted-foreground">{totalProduct} products</p>
    </div>
  );
};

export default ProductHeader;
