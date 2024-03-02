"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchAccount, selectAccount } from "@/lib/features/accounts/accountsSlice";
import { selectCustomer } from "@/lib/features/customers/customerSlice";
import { CustomerGuard } from "@/app/guards/CustomerGuard";
import { CustomerDashboard } from "./dashboard";

export default function CustomerPage() {
  const dispatch = useAppDispatch();
  const customer = useAppSelector(selectCustomer);
  const account = useAppSelector(selectAccount);

  useEffect(() => {
    if (customer && !account) {
      dispatch(fetchAccount(customer.accounts[0].id));
    }
  }, [account, customer, dispatch]);

  if (!account || !customer) {
    return (
      <CustomerGuard>
        <></>
      </CustomerGuard>
    );
  }

  return <CustomerDashboard />;
}
