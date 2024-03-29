import { User } from "./User";

export type Bank = {
  id: number;
  name: string;
  description: string;
  slug: string;
  user_id: number;
  owner: User;
  created_at: Date | string;
  updated_at: Date | string;
};
