"use client";

import { SegmentedButton } from "@/app/components/buttons/SegmentedButton";
import { Dialog } from "@/app/components/dialog/Dialog";
import { MatIcon } from "@/app/components/icons/MatIcon";
import { useSnackbar } from "@/app/components/snackbar/snackbar-context";
import { useAuth } from "@/app/guards/AuthContext";
import { AMOUNT_TOO_LARGE, hasErrors } from "@/app/utils/form-validators";
import { formatCurrency } from "@/app/utils/formatters";
import { PUT } from "@/app/utils/http-client";
import { fetchAccount, selectAccount } from "@/lib/features/accounts/accountsSlice";
import {
  fetchCustomer,
  fetchCustomers,
  selectCustomer,
} from "@/lib/features/customers/customerSlice";
import { dialogsAction } from "@/lib/features/dialogs/dialogsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useState } from "react";

export function TransferMoneyDialog() {
  const dispatch = useAppDispatch();
  const customer = useAppSelector(selectCustomer);
  const { isLoggedIn } = useAuth();
  const { showSnackbar } = useSnackbar();
  const currentAccount = useAppSelector(selectAccount);

  const [formData, setFormData] = useState({
    transactionType: "",
    accountId: currentAccount?.id + "",
    amount: "",
    description: "",
  });
  const [formErrors, setFormErrors] = useState({
    transactionType: "",
    accountId: "",
    amount: "",
    description: "",
  });

  function closeTransferMoneyDialog() {
    dispatch(dialogsAction.closeTransferMoney());
  }

  function handleChange(event: any) {
    const { name, value } = event.target;

    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  }

  function validateField(name: keyof typeof formData, value: string) {
    const errors = { ...formErrors };

    if (!value) {
      setFormErrors({ ...formErrors, [name]: "" });
      return;
    }

    switch (name) {
      case "amount":
        const amount = parseFloat(value.replace(/[^\d.]/g, ""));

        if (amount > 250_000_000) {
          errors.amount = AMOUNT_TOO_LARGE;
        } else if (amount === 0) {
          errors.amount = "Must be greater than 0";
        } else {
          errors.amount = "";
          setFormData({ ...formData, amount: amount.toString() });
        }
        break;
      case "description":
        if (value.length > 35) {
          errors.description = "Description can only be 35 characters";
        }
        break;
    }

    setFormErrors(errors);
  }

  function formatAmount(event: any): void {
    const numericValue = parseFloat(formData.amount.replace(/[^\d.]/g, ""));

    if (!isNaN(numericValue)) {
      const formattedValue = formatCurrency(numericValue);
      event.target.value = formattedValue;
    } else {
      event.target.value = "";
    }
  }

  function isInvalid() {
    return Object.values(formData).some((value) => !value) || hasErrors(formErrors);
  }

  async function createTransfer(event: any) {
    event.preventDefault();

    const isWithdraw = formData.transactionType === "withdraw";
    const payload = {
      account_id: parseInt(formData.accountId, 10),
      description: formData.description,
      amount: parseFloat(formData.amount) * (isWithdraw ? -1 : 1),
    };

    try {
      const response = await PUT("/transactions", payload);

      if (response.ok) {
        closeTransferMoneyDialog();

        if (isLoggedIn) {
          dispatch(fetchCustomers(customer!.bank_id));
          showSnackbar(
            `Successfully ${isWithdraw ? "withdrew" : "deposited"} ${formatCurrency(
              parseFloat(formData.amount)
            )} ${isWithdraw ? "from" : "into"} the account`
          );
        } else {
          dispatch(fetchCustomer(customer!.id));
          showSnackbar(
            "Successfully created a request. Please wait while your bank approves or declines this transaction"
          );
        }

        dispatch(fetchAccount(formData.accountId));
      } else {
        const { message } = await response.json();
        showSnackbar(message);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Dialog>
      <header>
        <MatIcon icon="price-change-outline" />
        <h1 className="capitalize">Transfer Request for {customer?.first_name}</h1>
      </header>
      <form className="flex flex-col gap-3" onSubmit={createTransfer}>
        <main className="flex flex-col gap-2">
          <SegmentedButton>
            <input
              id="transaction_type_deposit"
              name="transactionType"
              type="radio"
              value="deposit"
              onChange={handleChange}
            />
            <label htmlFor="transaction_type_deposit" className="w-1/2">
              Deposit
            </label>
            <input
              id="transaction_type_withdraw"
              name="transactionType"
              type="radio"
              value="withdraw"
              onChange={handleChange}
            />
            <label htmlFor="transaction_type_withdraw" className="w-1/2">
              Withdraw
            </label>
          </SegmentedButton>
          {!currentAccount && (
            <div className="form-field">
              <label htmlFor="select_account">Select Account</label>
              <select
                id="select_account"
                name="accountId"
                disabled={!customer || customer.accounts.length === 1}
                onChange={handleChange}
              >
                {customer?.accounts.map((account) => {
                  return (
                    <option key={account.id} value={account.id}>
                      {account.name} - {formatCurrency(account.balance ?? 0)}
                    </option>
                  );
                })}
              </select>
            </div>
          )}
          <div className={`form-field ${formErrors.amount && "error"}`}>
            <label htmlFor="transfer_money_dialog_amount">Amount</label>
            <input
              id="transfer_money_dialog_amount"
              type="text"
              name="amount"
              inputMode="decimal"
              maxLength={15}
              onChange={handleChange}
              onBlur={formatAmount}
            />
            <div className="error-message">{formErrors.amount}</div>
          </div>
          <div className="form-field">
            <label htmlFor="transfer_money_dialog_description">Description</label>
            <input
              id="transfer_money_dialog_description"
              name="description"
              maxLength={35}
              onChange={handleChange}
              placeholder="Enter a very short description"
              type="text"
            />
          </div>
        </main>
        <footer>
          <input
            type="reset"
            onClick={closeTransferMoneyDialog}
            className="common ghost"
            value="Cancel"
          />
          <input type="submit" value="Complete" className="common ghost" disabled={isInvalid()} />
        </footer>
      </form>
    </Dialog>
  );
}
