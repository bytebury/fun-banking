import { formatCurrency, formatDate } from "@/app/utils/formatters";
import {
  fetchCompletedTransactions,
  selectCompletedTransactions,
} from "@/lib/features/accounts/accountsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { ThunkStatus } from "@/lib/thunk";
import Link from "next/link";
import React from "react";
import { useEffect, useState } from "react";

type RecentTransactionsProps = {
  account: any;
};

export function RecentTransactions({ account }: RecentTransactionsProps) {
  const dispatch = useAppDispatch();
  const { data: transactions, status } = useAppSelector(selectCompletedTransactions);
  const [pageNumber, setPageNumber] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    if (account) {
      dispatch(fetchCompletedTransactions({ account, pageNumber, itemsPerPage }));
    }
  }, [dispatch, account, pageNumber]);

  function goToNextPage(): void {
    setPageNumber((pageNumber) => (pageNumber += 1));
  }

  function goToPreviousPage(): void {
    setPageNumber((pageNumber) => (pageNumber -= 1));
  }

  if (!transactions.items || status === ThunkStatus.Loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="text-left">
        <div className="grid grid-cols-2 bg-gray-200 border border-outline rounded-t-[10px] px-3 py-2 font-bold">
          <div>Description</div>
          <div></div>
        </div>
        {transactions.items.length === 0 && (
          <div className="col-span-2 text-left px-3 py-2 bg-white text-gray-500 border border-outline border-t-0 last:rounded-b-[10px]">
            There have been no completed transactions yet.
          </div>
        )}
        {transactions.items.length > 0 &&
          transactions.items.map((transaction: any) => {
            return (
              <div
                key={transaction.id}
                className={`grid grid-cols-2 bg-white px-3 py-2 border border-outline border-t-0 last-of-type:rounded-b-[10px] last:rounded-b-[10px] items-center hover:bg-slate-50 ${
                  transaction.status === "declined" ? "line-through text-gray-400" : ""
                }`}
              >
                <div className="flex flex-col">
                  <div className={`text-gray-500 text-xs`}>
                    <span className="capitalize">{transaction.status}</span> by{" "}
                    <Link href={`/profile/${transaction.user.username}`} className="capitalize">
                      {transaction.user.first_name} {transaction.user.last_name}
                    </Link>
                  </div>
                  <p>{transaction.description}</p>
                  <time className="text-gray-500 text-xs" dateTime={transaction.created_at}>
                    {formatDate(transaction.created_at, { hour: "numeric", minute: "numeric" })}
                  </time>
                </div>
                <div className="text-right">
                  <p
                    className={`font-bold ${
                      transaction.status === "declined"
                        ? "text-gray-400"
                        : transaction.amount < 0
                        ? "text-pink-600"
                        : "text-emerald-700"
                    }`}
                  >
                    {formatCurrency(transaction.amount)}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {formatCurrency(transaction.current_balance)}
                  </p>
                </div>
              </div>
            );
          })}
      </div>
      <div className="flex justify-between">
        <button onClick={goToPreviousPage} className="common outlined" disabled={pageNumber === 1}>
          Previous
        </button>
        <button
          onClick={goToNextPage}
          className="common outlined"
          disabled={pageNumber * itemsPerPage >= transactions.total_items}
        >
          Next
        </button>
      </div>
    </>
  );
}
