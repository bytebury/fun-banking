import { User } from './user.model';

export enum TransferStatus {
  APPROVED = 'approved',
  DECLINED = 'declined',
  PENDING = 'pending',
}

export interface Transfer {
  id: number;
  amount: number;
  description: string;
  current_balance: number;
  status: TransferStatus;
  account_id: number;
  user_id?: number;
  created_at?: Date;
  updated_at?: Date;
  updated_by?: User;
}
