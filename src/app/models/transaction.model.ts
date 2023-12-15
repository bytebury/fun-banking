export enum TransactionStatus {
  APPROVED = 'approved',
  DECLINED = 'declined',
}

export interface Transaction {
  id: string;
  amount: number;
  status: TransactionStatus;
  created_at: Date;
  updated_at: Date;
}
