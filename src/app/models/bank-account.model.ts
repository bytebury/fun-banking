import { Customer } from './customer.model';

export interface BankAccount {
  id: number;
  name: string;
  balance: number;
  customer_id: number;
  customer: Customer;
  updated_at: Date;
  created_at: Date;
}
