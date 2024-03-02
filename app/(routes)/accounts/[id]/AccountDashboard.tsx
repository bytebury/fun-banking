"use client";

import { Card } from "@/app/components/card/Card";
import { formatCurrency } from "@/app/utils/formatters";
import { TransferMoneyDialog } from "../../banks/[id]/dialogs/TransferMoneyDialog";
import { RecentTransactions } from "./RecentTransactions";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { dialogsAction } from "@/lib/features/dialogs/dialogsSlice";
import { selectCustomer } from "@/lib/features/customers/customerSlice";
import { TransactionBreakdownChart } from "./TransactionBreakdownChart";
import { MatIcon } from "@/app/components/icons/MatIcon";
import { useAuth } from "@/app/guards/AuthContext";
import { EditAccountNameDialog } from "./EditNameDialog";

type AccountDashboardProps = { account: any };

export function AccountDashboard({ account }: AccountDashboardProps) {
  const dispatch = useAppDispatch();
  const customer = useAppSelector(selectCustomer);
  const dialogs = useAppSelector((state) => state.dialogs);
  const { isLoggedIn } = useAuth();

  function openTransferMoneyDialog(): void {
    dispatch(dialogsAction.openTransferMoney());
  }

  function openEditDialog(): void {
    dispatch(dialogsAction.openEditAccount());
  }

  if (!customer || !account) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <div className="flex flex-col gap-2 text-center py-2">
          <div className="flex items-center justify-center gap-1 text-xl">
            <div>
              <span className="capitalize">
                {customer.first_name} {customer.last_name}
              </span>{" "}
              &mdash; <span className="capitalize">{account.name}</span>
            </div>
            {isLoggedIn && (
              <button onClick={openEditDialog} className="icon ghost">
                <MatIcon icon="edit-outline" />
              </button>
            )}
          </div>
          <span className="text-3xl font-extrabold">{formatCurrency(account.balance)}</span>
          <div className="flex justify-center">
            <button
              onClick={openTransferMoneyDialog}
              className="font-normal underline text-primary"
            >
              Withdraw or Deposit
            </button>
          </div>
        </div>
      </Card>
      <Card type="outlined">
        <h1>This Month</h1>
        <TransactionBreakdownChart account={account} />
      </Card>
      <RecentTransactions account={account} />
      {dialogs.transferMoney && <TransferMoneyDialog />}
      {dialogs.editAccount && <EditAccountNameDialog />}
    </div>
  );
}
