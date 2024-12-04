export type TProduct = {
  id: number;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  colors: string[];
  sizes: string[];
  categories: string[];
};
