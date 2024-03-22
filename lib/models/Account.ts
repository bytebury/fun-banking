import { Customer } from "./Customer";

export type Account = {
  id: number;
  name: string;
  balance: number;
  customer_id: number;
  customer: Customer;
  type: "checking";
  created_at: Date | string;
  updated_at: Date | string;
};
