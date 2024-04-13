"use client";

import { fetchBanks, selectAllBanks, selectAllBanksStatus } from "@/lib/features/banks/banksSlice";
import { dialogsAction } from "@/lib/features/dialogs/dialogsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { ThunkStatus } from "@/lib/thunk";
import Link from "next/link";
import { useEffect } from "react";

export function BankList() {
  const dispatch = useAppDispatch();
  const banks = useAppSelector(selectAllBanks);
  const banksStatus = useAppSelector(selectAllBanksStatus);

  useEffect(() => {
    if (banksStatus === ThunkStatus.Idle) {
      dispatch(fetchBanks());
    }
  }, [banksStatus, dispatch]);

  function openCreateBankDialog() {
    dispatch(dialogsAction.openCreateBankDialog());
  }

  if (banksStatus === ThunkStatus.Loading || !banks) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 3 }).map((_, index) => {
          return (
            <div key={index} className="flex items-center gap-2">
              <div className="shimmer w-6 h-6 rounded-full bg-gray-100 shrink-0"></div>
              <div className="shimmer w-full h-6 bg-gray-100 rounded-full"></div>
            </div>
          );
        })}
      </div>
    );
  }

  if (banks && banks.length === 0) {
    return (
      <div className="text-gray-600 text-sm">
        It seems like you don&apos;t have any banks yet. Do you want to{" "}
        <button onClick={openCreateBankDialog} className="inline text-primary underline">
          create one
        </button>
        ?
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-1">
      {banks.map((bank: any) => {
        return (
          <li key={bank.id}>
            <Link className="flex items-center gap-2 text-sm" href={`/banks/${bank.id}`}>
              {/*eslint-disable-next-line @next/next/no-img-element*/}
              <img
                alt={bank.owner.username}
                className="w-6 h-6 rounded-full shrink-0"
                src={bank.owner.avatar}
                width={24}
                height={24}
              />
              {bank.owner.username}/{bank.slug}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
