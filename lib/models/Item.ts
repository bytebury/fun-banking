import { Shop } from "./Shop";

export type Item = {
  id: number;
  shop_id: number;
  shop?: Shop;
  name: string;
  description: string;
  price: number;
  number_in_stock: number;
  created_at: Date;
  updated_at: Date;
};
