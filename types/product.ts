export interface Product {
  id: number | string;
  title: string;
  price: number;
  currency?: string | null;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}
