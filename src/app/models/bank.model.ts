import { User } from './user.model';

export interface Bank {
  id: string;
  name: string;
  slug: string;
  description: string;
  owner: User;
  created_at?: Date;
  updated_at?: Date;
}
