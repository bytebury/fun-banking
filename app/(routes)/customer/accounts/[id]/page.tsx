"use client";

import { AccountDashboard } from "@/app/(routes)/accounts/[id]/AccountDashboard";
import { CustomerGuard } from "@/app/guards/CustomerGuard";
import { fetchAccount, selectAccount } from "@/lib/features/accounts/accountsSlice";
import { appBarActions } from "@/lib/features/app-bar/appBarSlice";
import { dialogsAction } from "@/lib/features/dialogs/dialogsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function CustomerAccountPage() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const account = useAppSelector(selectAccount);

  useEffect(() => {
    dispatch(fetchAccount(id as string));
    dispatch(appBarActions.displayGoBack());
    dispatch(dialogsAction.closeViewCustomer());

    return () => {
      dispatch(appBarActions.displayDefault());
    };
  }, [dispatch, id]);

  if (id && !account) {
    return <>Loading...</>;
  }

  return (
    <CustomerGuard>
      <AccountDashboard account={account} />
    </CustomerGuard>
  );
}
