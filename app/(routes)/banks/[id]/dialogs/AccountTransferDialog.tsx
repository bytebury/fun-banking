import { Dialog } from "@/app/components/dialog/Dialog";
import { MatIcon } from "@/app/components/icons/MatIcon";
import { useSnackbar } from "@/app/components/snackbar/snackbar-context";
import {
  AMOUNT_TOO_LARGE,
  INVALID_NAME_MESSAGE,
  INVALID_PIN_MESSAGE,
  hasErrors,
  isValidName,
  isValidPin,
} from "@/app/utils/form-validators";
import { formatCurrency } from "@/app/utils/formatters";
import { POST } from "@/app/utils/http-client";
import { fetchAccount, selectAccount } from "@/lib/features/accounts/accountsSlice";
import { selectCustomer } from "@/lib/features/customers/customerSlice";
import { dialogsAction } from "@/lib/features/dialogs/dialogsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useState } from "react";

export function AccountTransferDialog() {
  const dispatch = useAppDispatch();
  const customer = useAppSelector(selectCustomer);
  const account = useAppSelector(selectAccount);
  const { showSnackbar } = useSnackbar();

  const [isDisabled, setIsDisabled] = useState(false);
  const [formData, setFormData] = useState({
    fromAccount: -1,
    toAccount: -1,
    amount: "",
  });
  const [formErrors, setFormErrors] = useState({
    fromAccount: "",
    toAccount: "",
    amount: "",
  });

  type FormField = keyof typeof formData;

  function handleChange(event: any) {
    const { name, value } = event.target;

    switch (name) {
      case "fromAccount":
      case "toAccount":
        setFormData({ ...formData, [name]: parseInt(value) });
        break;
      default:
        setFormData({ ...formData, [name]: value });
    }

    validate(name, value);
  }

  function validate(name: FormField, value: string) {
    const errors = { ...formErrors };

    if (!value) {
      errors[name] = "";
      setFormErrors(errors);
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
    }

    setFormErrors(errors);
  }

  function isInvalid() {
    return Object.values(formData).some((value) => !value) || hasErrors(formErrors);
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

  async function transferMoney(event: any) {
    event.preventDefault();

    setIsDisabled(true);

    try {
      const payload = {
        from_account_id: formData.fromAccount,
        to_account_id: formData.toAccount,
        amount: Math.abs(parseFloat(formData.amount)),
      };
      const response = await POST("/accounts/transfer", payload);

      if (response.ok) {
        closeDialog();
        dispatch(fetchAccount(account.id));
        showSnackbar("Successfully transfered money to your other account");
      } else {
        const { message } = await response.json();
        showSnackbar(message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsDisabled(false);
    }
  }

  function closeDialog() {
    dispatch(dialogsAction.closeAccountTransfer());
  }

  return (
    <Dialog>
      <header>
        <MatIcon icon="animation" />
        <h1>Transfer Between Accounts</h1>
      </header>
      <form onSubmit={transferMoney} className="flex flex-col gap-4">
        <main>
          <div className={`form-field ${formErrors.fromAccount && "error"}`}>
            <label htmlFor="fromAccount">From Account</label>
            <select
              id="fromAccount"
              name="fromAccount"
              disabled={!customer || customer.accounts.length === 1}
              onChange={handleChange}
            >
              <option>Select an Account</option>
              {customer?.accounts
                .filter((account) => account.id !== formData.toAccount)
                .map((account) => {
                  return (
                    <option key={account.id} value={account.id}>
                      {account.name} - {formatCurrency(account.balance ?? 0)}
                    </option>
                  );
                })}
            </select>
            <div className="error-message">{formErrors.fromAccount}</div>
          </div>
          <div className={`form-field ${formErrors.toAccount && "error"}`}>
            <label htmlFor="toAccount">To Account</label>
            <select
              id="toAccount"
              name="toAccount"
              disabled={!customer || customer.accounts.length === 1}
              onChange={handleChange}
            >
              <option>Select an Account</option>
              {customer?.accounts
                .filter((account) => account.id !== formData.fromAccount)
                .map((account) => {
                  return (
                    <option key={account.id} value={account.id}>
                      {account.name} - {formatCurrency(account.balance ?? 0)}
                    </option>
                  );
                })}
            </select>
            <div className="error-message">{formErrors.toAccount}</div>
          </div>
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
        </main>
        <footer>
          <input type="reset" onClick={closeDialog} className="common ghost" value="Cancel" />
          <input
            type="submit"
            value="Transfer Funds"
            className="common ghost"
            disabled={isInvalid() || isDisabled}
          />
        </footer>
      </form>
    </Dialog>
  );
}
