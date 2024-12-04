import { LayoutGrid, List } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

const ProductView = () => {
  return (
    <div className="flex items-center gap-2">
      <Button variant={"outline"} size={"icon"}>
        <LayoutGrid className="h-4 w-4" />
      </Button>
      <Button variant={"outline"} size={"icon"}>
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ProductView;
