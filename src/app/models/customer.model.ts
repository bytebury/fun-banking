import { BankAccount } from './bank-account.model';

export interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  pin: string;
  bank_id: number;
  accounts: BankAccount[];
  bankBalance?: number;
}
