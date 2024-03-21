"use client";

import { MatIcon } from "@/app/components/icons/MatIcon";
import { dialogsAction } from "@/lib/features/dialogs/dialogsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { CustomersTable } from "./CustomersTable";
import { AddCustomerDialog } from "./dialogs/AddCustomerDialog";
import { customerAction, selectCustomers } from "@/lib/features/customers/customerSlice";
import { useState } from "react";
import { Switch } from "@/app/components/switch/Switch";

export default function BankPage() {
  const dialogs = useAppSelector((state) => state.dialogs);
  const dispatch = useAppDispatch();
  const customers = useAppSelector(selectCustomers);
  const [customerSearch, setCustomerSearch] = useState("");
  const filteredCustomers = customers.filter((customer) => {
    const fullName = `${customer.first_name} ${customer.last_name} ${customer.pin}`.toLowerCase();
    return fullName.includes(customerSearch.toLowerCase());
  });

  const searchCustomers = (
    <form className="-mt-4">
      <div className="form-field">
        <label htmlFor="customer-search">Customer Search</label>
        <input
          id="customer-search"
          name="customerSearch"
          type="text"
          placeholder="Search for customer..."
          onChange={handleCustomerSearch}
        />
      </div>
    </form>
  );

  function handleCustomerSearch(event: any): void {
    setCustomerSearch(event.target.value);
  }

  function openAddCustomerDialog() {
    dispatch(dialogsAction.openAddCustomerDialog());
  }

  function handleSwitch(value: boolean): void {
    dispatch(customerAction.setMultiSelect(value));
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <div className="text-sm flex gap-2 items-center">
            Bulk Transfer <Switch id="okay" onChange={handleSwitch} />
          </div>
          <button onClick={openAddCustomerDialog} className="sm common filled">
            <MatIcon icon="add" />
            New Customer
          </button>
        </div>
        {customers?.length > 6 ? searchCustomers : null}
        <CustomersTable customers={filteredCustomers} />
      </div>
      {dialogs.addCustomer && <AddCustomerDialog />}
    </>
  );
}
