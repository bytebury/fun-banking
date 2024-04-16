import { Item } from "./Item";
import { User } from "./User";

export type Shop = {
  id: number;
  name: string;
  tax_rate: number;
  user_id: number;
  user: User;
  items: Item[];
  created_at: Date;
  updated_at: Date;
};

export type ShopRequest = Pick<Shop, "name" | "tax_rate">;
