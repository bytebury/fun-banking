"use client";

import { Card } from "@/app/components/card/Card";
import { formatCurrency, formatDate } from "@/app/utils/formatters";
import { TransferMoneyDialog } from "../../banks/[id]/dialogs/TransferMoneyDialog";
import { RecentTransactions } from "./RecentTransactions";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { dialogsAction } from "@/lib/features/dialogs/dialogsSlice";
import { selectCustomer } from "@/lib/features/customers/customerSlice";
import { TransactionBreakdownChart } from "./TransactionBreakdownChart";
import { MatIcon } from "@/app/components/icons/MatIcon";
import { useAuth } from "@/app/guards/AuthContext";
import { EditAccountNameDialog } from "./EditNameDialog";
import { Notice } from "@/app/components/notice/Notice";
import { useEffect, useState } from "react";
import { GET } from "@/app/utils/http-client";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { AccountStatementDocument } from "./AccountStatementDocument";
import { PayBuddyTransferDialog } from "../../banks/[id]/dialogs/PayBuddyTransferDialog";

type AccountDashboardProps = { account: any };

export function AccountDashboard({ account }: AccountDashboardProps) {
  const dispatch = useAppDispatch();
  const customer = useAppSelector(selectCustomer);
  const dialogs = useAppSelector((state) => state.dialogs);
  const [statement, setStatement] = useState([]);
  const { isLoggedIn } = useAuth();
  const statementMonth = new Date().getMonth() - 1 < 0 ? 11 : new Date().getMonth();
  const statementYear =
    statementMonth === 11 ? new Date().getFullYear() - 1 : new Date().getFullYear();
  const statementEndMonth = statementMonth === 11 ? 0 : statementMonth + 1;
  const statementEndYear =
    statementMonth === 11 ? new Date().getFullYear() + 1 : new Date().getFullYear();

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const response = await GET(
          `/accounts/${account.id}/transactions?status=approved&startDate=${statementYear}-${statementMonth}-1&endDate=${statementEndYear}-${statementEndMonth}-1&limit=250&direction=ASC`
        );

        if (!response.ok) return;

        const data = await response.json();
        setStatement(data.items);
      } catch (error) {
        console.error(error);
      }
    };

    if (account) {
      fetchAccount();
    }
  }, [account, statementEndMonth, statementEndYear, statementMonth, statementYear]);

  function openTransferMoneyDialog(): void {
    dispatch(dialogsAction.openTransferMoney());
  }

  function openEditDialog(): void {
    dispatch(dialogsAction.openEditAccount());
  }

  function openPayBuddyTransferDialog(): void {
    dispatch(dialogsAction.openPayBuddyTransfer());
  }

  function getStatementAsCSV(): any[] {
    return statement.map((row: any) => {
      return [
        row.updated_at.slice(0, 10),
        row.description.replace(",", ""),
        row.amount < 0 ? formatCurrency(row.amount) : "",
        row.amount >= 0 ? formatCurrency(row.amount) : "",
        formatCurrency(row.current_balance),
      ];
    });
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
          <div className="flex justify-center gap-2">
            <button
              onClick={openTransferMoneyDialog}
              className="font-normal underline text-primary"
            >
              Withdraw or Deposit
            </button>
            &middot;
            <button
              onClick={openPayBuddyTransferDialog}
              className="font-normal underline text-primary"
            >
              Send Money
            </button>
          </div>
        </div>
      </Card>
      {statement.length > 0 && (
        <Notice icon="receipt-long-outline" type="info">
          <div className="flex justify-between w-full items-center">
            <div>You have a bank statement ready from last month!</div>
            <PDFDownloadLink
              fileName={`${formatDate(new Date(`${statementYear}-${statementMonth}`), {
                month: "long",
                year: "numeric",
                day: undefined,
              })}-${account.name.toUpperCase()}-${customer.first_name.toLowerCase()}-${customer.last_name.toLowerCase()}`}
              document={
                <AccountStatementDocument
                  account={account}
                  customer={customer}
                  data={getStatementAsCSV()}
                />
              }
            >
              Download
            </PDFDownloadLink>
          </div>
        </Notice>
      )}
      <Card type="outlined">
        <h1>This Month</h1>
        <TransactionBreakdownChart account={account} />
      </Card>
      <RecentTransactions account={account} />
      {dialogs.transferMoney && <TransferMoneyDialog />}
      {dialogs.editAccount && <EditAccountNameDialog />}
      {dialogs.payBuddyTransfer && <PayBuddyTransferDialog />}
    </div>
  );
}
