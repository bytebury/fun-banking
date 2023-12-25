import { Bank } from './bank.model';
import { User } from './user.model';

export interface Employee {
  id: number;
  user_id: number;
  bank_id: number;
  bank: Bank;
  user: User;
  created_at: Date;
  updated_at: Date;
}
