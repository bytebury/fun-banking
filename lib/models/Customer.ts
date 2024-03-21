import { Account } from "./Account";
import { Bank } from "./Bank";

export type Customer = {
  id: number;
  first_name: string;
  last_name: string;
  pin: string;
  bank_id: number;
  bank: Bank;
  accounts: Account[];
  isSelected?: boolean;
};
