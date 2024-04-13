import { User } from "./User";

export type Shop = {
  id: number;
  name: string;
  tax_rate: number;
  user_id: number;
  user: User;
  created_at: Date;
  updated_at: Date;
};

export type ShopRequest = Pick<Shop, "name" | "tax_rate">;
