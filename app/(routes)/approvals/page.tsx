"use client";

import { Card } from "@/app/components/card/Card";
import { useSnackbar } from "@/app/components/snackbar/snackbar-context";
import { AuthenticatedGuard } from "@/app/guards/AuthGuard";
import { formatCurrency, formatDate } from "@/app/utils/formatters";
import { PATCH, PUT } from "@/app/utils/http-client";
import {
  fetchApprovals,
  selectPendingApprovals,
} from "@/lib/features/pending-transactions/pendingTransactionsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

export default function ApprovalsPage() {
  // transactions/id/approve <-- action
  // transactions/id/decline <-- action
  const dispatch = useAppDispatch();
  const pendingTransactions = useAppSelector(selectPendingApprovals);
  const { showSnackbar } = useSnackbar();

  async function approve(transaction: any): Promise<void> {
    try {
      const response = await PATCH(`/transactions/${transaction.id}/approve`, {});

      if (response.ok) {
        showSnackbar(`Approved transaction for ${transaction.description}`);
        dispatch(fetchApprovals());
      } else {
        const { message } = await response.json();
        showSnackbar(message);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function decline(transaction: any): Promise<void> {
    try {
      const response = await PATCH(`/transactions/${transaction.id}/decline`, {});

      if (response.ok) {
        showSnackbar(`Declined transaction for ${transaction.description}`);
        dispatch(fetchApprovals());
      } else {
        const { message } = await response.json();
        showSnackbar(message);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <AuthenticatedGuard>
      <main className="container max-w-xl">
        <Card className="flex flex-col" type="outlined">
          <h1>Pending Approvals</h1>
          {pendingTransactions.length === 0 ? (
            <div className="flex flex-col gap-2 text-gray-500">
              <p>
                You&apos;re all caught up on approvals! Kudos for staying on top of everything. 👏
              </p>
              <p>
                Future requests from your customers will appear here for you to approve or decline.
                For now, you can rest easy. 😌
              </p>
            </div>
          ) : (
            <ul className="mt-3">
              {pendingTransactions.map((transaction) => {
                return (
                  <li className="border-t pt-5 mt-5 first:mt-0" key={transaction.id}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-gray-500 text-xs">
                          <span className="capitalize">
                            {transaction.account.customer.first_name}{" "}
                            {transaction.account.customer.last_name}
                          </span>{" "}
                          &mdash; {transaction.account.name}
                        </div>
                        <div className="font-extrabold text-2xl">
                          {formatCurrency(transaction.amount)}
                        </div>
                        <div className="flex flex-col gap-1 text-gray-500 text-xs">
                          <div>NOTE: {transaction.description}</div>
                          <div>
                            {formatDate(transaction.created_at, {
                              hour: "numeric",
                              minute: "numeric",
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row items-end gap-2 shrink-0">
                        <button onClick={() => approve(transaction)} className="common outlined sm">
                          Approve
                        </button>
                        <button
                          onClick={() => decline(transaction)}
                          className="common outlined-error sm"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </main>
    </AuthenticatedGuard>
  );
}
