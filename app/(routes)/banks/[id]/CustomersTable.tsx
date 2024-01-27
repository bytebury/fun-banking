import { MatIcon } from "@/app/components/icons/MatIcon";
import PopoverMenu from "@/app/components/popovers/PopoverMenu";
import {
  customerAction,
  selectCustomers,
  selectCustomersStatus,
} from "@/lib/features/customers/customerSlice";
import { dialogsAction } from "@/lib/features/dialogs/dialogsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import React from "react";
import { UpdateCustomerDialog } from "./dialogs/UpdateCustomerDialog";
import { DeleteCustomerDialog } from "./dialogs/DeleteCustomerDialog";
import { ThunkStatus } from "@/lib/thunk";
import { TransferMoneyDialog } from "./dialogs/TransferMoneyDialog";
import { ViewCustomerDialog } from "./dialogs/ViewCustomerDialog";
import { formatCurrency } from "@/app/utils/formatters";

export function CustomersTable() {
  const dispatch = useAppDispatch();
  const dialogs = useAppSelector<any>((state) => state.dialogs);
  const customers = useAppSelector(selectCustomers);
  const customersStatus = useAppSelector(selectCustomersStatus);

  function openDeleteCustomerDialog(customer: any) {
    dispatch(customerAction.setCustomer(customer));
    dispatch(dialogsAction.openDeleteCustomer());
  }

  function openCreateCustomerDialog(): void {
    dispatch(dialogsAction.openAddCustomerDialog());
  }

  function openEditCustomerDialog(customer: any): void {
    dispatch(customerAction.setCustomer(customer));
    dispatch(dialogsAction.openEditCustomer());
  }

  function openTransferMoneyDialog(customer: any): void {
    dispatch(customerAction.setCustomer(customer));
    dispatch(dialogsAction.openTransferMoney());
  }

  function openViewCustomerDialog(customer: any): void {
    dispatch(customerAction.setCustomer(customer));
    dispatch(dialogsAction.openViewCustomer());
  }

  if (customersStatus === ThunkStatus.Loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div>
        <div className="grid grid-cols-12 rounded-t-2xl border border-b-0 border-outline bg-gray-100 font-bold text-gray-700 py-2 px-3">
          <div className="col-span-5">Customer</div>
          <div className="col-span-7 text-right pr-11">Balance</div>
        </div>
        {customers.length === 0 ? (
          <div className="rounded-b-2xl border border-outline px-3 py-2 text-gray-600">
            You do not have any customers yet. Would you like to{" "}
            <button className="inline underline text-primary" onClick={openCreateCustomerDialog}>
              create one
            </button>
            ?
          </div>
        ) : (
          customers.map((customer: any) => {
            return (
              <div
                key={customer.id}
                className="grid grid-cols-12 items-center last:rounded-b-2xl border border-b-0 last:border-b border-outline px-3 py-2 hover:bg-slate-50"
              >
                <div className="col-span-5">
                  <div className="font-bold capitalize">
                    {customer.first_name} {customer.last_name}
                  </div>
                  <div className="text-gray-600 text-xs">PIN-{customer.pin}</div>
                </div>
                <div className="flex items-center justify-end gap-2 col-span-7 text-right font-bold">
                  <div>
                    <span>
                      {formatCurrency(
                        customer.accounts.reduce((a: any, b: any) => a + b.balance, 0)
                      )}
                    </span>
                  </div>
                  <PopoverMenu>
                    <ul>
                      <li>
                        <button
                          onClick={() => openViewCustomerDialog(customer)}
                          className="capitalize"
                        >
                          <MatIcon icon="visibility-outline" />
                          View {customer.first_name}
                        </button>
                      </li>
                      <li>
                        <button onClick={() => openTransferMoneyDialog(customer)}>
                          <MatIcon icon="price-change-outline" />
                          Transfer Money
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => openEditCustomerDialog(customer)}
                          className="capitalize"
                        >
                          <MatIcon icon="edit-outline" />
                          Edit {customer.first_name}
                        </button>
                      </li>
                      <hr />
                      <li>
                        <button
                          onClick={() => openDeleteCustomerDialog(customer)}
                          className="capitalize"
                        >
                          <MatIcon icon="delete-outline" />
                          Delete {customer.first_name}
                        </button>
                      </li>
                    </ul>
                  </PopoverMenu>
                </div>
              </div>
            );
          })
        )}
      </div>
      {dialogs.deleteCustomer && <DeleteCustomerDialog />}
      {dialogs.editCustomer && <UpdateCustomerDialog />}
      {dialogs.transferMoney && <TransferMoneyDialog />}
      {dialogs.viewCustomer && <ViewCustomerDialog />}
    </>
  );
}