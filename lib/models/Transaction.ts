import { Account } from "./Account";
import { User } from "./User";

export type Transaction = {
  id: number;
  description: string;
  current_balance: number;
  amount: number;
  status: TransactionStatus;
  account_id: number;
  account: Account;
  user_id: number;
  user: User;
  created_at: Date | string;
  updated_at: Date | string;
  type: TransactionType;
};

export enum TransactionType {
  Manual = "manual",
  BankBuddy = "bank_buddy",
  Transfer = "transfer",
  Shopping = "shopping",
}

export enum TransactionStatus {
  Pending = "pending",
  Declined = "declined",
  Approved = "approved",
}
