import { SegmentedButton } from "@/app/components/buttons/SegmentedButton";
import { Dialog } from "@/app/components/dialog/Dialog";
import { MatIcon } from "@/app/components/icons/MatIcon";
import { Notice } from "@/app/components/notice/Notice";
import { useSnackbar } from "@/app/components/snackbar/snackbar-context";
import { Switch } from "@/app/components/switch/Switch";
import { AMOUNT_TOO_LARGE, hasErrors } from "@/app/utils/form-validators";
import { formatCurrency } from "@/app/utils/formatters";
import { PUT } from "@/app/utils/http-client";
import {
  selectCustomers,
  fetchCustomers,
  customerAction,
} from "@/lib/features/customers/customerSlice";
import { dialogsAction } from "@/lib/features/dialogs/dialogsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useRef, useState } from "react";

export function BulkTransferDialog() {
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    transactionType: "",
    amount: "",
    description: "",
  });
  const [formErrors, setFormErrors] = useState({
    transactionType: "",
    amount: "",
    description: "",
  });
  const [keepOpen, setKeepOpen] = useState(false);
  const { showSnackbar } = useSnackbar();

  const dispatch = useAppDispatch();
  const selectedCustomers = useAppSelector((state) => state.customers.selectedCustomers);
  const customers = useAppSelector(selectCustomers);
  const numberOfSelectedCustomers = useAppSelector(
    (state) => Object.keys(state.customers.selectedCustomers).length
  );

  function handleChange(event: any): void {
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

  async function createBulkTransfer(event: any): Promise<void> {
    event.preventDefault();

    const isWithdraw = formData.transactionType === "withdraw";
    const amount = parseFloat(formData.amount) * (isWithdraw ? -1 : 1);
    const description = formData.description;

    const payloads = Object.keys(selectedCustomers)
      .map((customerId: any) => {
        const customer = customers.find((customer) => customer.id === Number(customerId));
        if (customer) {
          return { account_id: customer.accounts[0].id, amount, description };
        }
      })
      .filter(Boolean);
    const requests = payloads.map((payload: any) => PUT("/transactions", payload));
    try {
      const response = await Promise.all(requests);

      if (response.every((r) => r.ok)) {
        showSnackbar(`Successfully processed transfers for all of the customers.`);
      } else {
        showSnackbar(
          `We were only able to transfer money to ${
            response.filter((r) => !r.ok).length
          } of the customers.`
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      if (!keepOpen) {
        dispatch(fetchCustomers(customers[0].bank_id));
        dispatch(customerAction.clearSelected());
        dispatch(dialogsAction.closeBulkTransfer());
      }

      resetForm();
    }
  }

  function close(): void {
    dispatch(fetchCustomers(customers[0].bank_id));
    dispatch(dialogsAction.closeBulkTransfer());
  }

  function resetForm(): void {
    setFormData({ transactionType: "", amount: "", description: "" });
    formRef.current?.reset();
  }

  return (
    <Dialog>
      <header>
        <MatIcon icon="savings-outline" />
        <h1>Bulk Money Transfer ({numberOfSelectedCustomers})</h1>
      </header>
      <form ref={formRef} className="flex flex-col gap-3" onSubmit={createBulkTransfer}>
        <main className="flex flex-col gap-2">
          <SegmentedButton>
            <input
              id="transaction_type_deposit"
              name="transactionType"
              type="radio"
              value="deposit"
              checked={formData.transactionType === "deposit"}
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
              checked={formData.transactionType === "withdraw"}
              onChange={handleChange}
            />
            <label htmlFor="transaction_type_withdraw" className="w-1/2">
              Withdraw
            </label>
          </SegmentedButton>
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
        <div className="w-full flex gap-2 items-center text-sm">
          <Switch
            id="test"
            onChange={(checked) => {
              setKeepOpen(checked);
            }}
            enabled={keepOpen}
          >
            Keep open?
          </Switch>
        </div>
        <footer>
          <input type="reset" onClick={close} className="common ghost" value="Cancel" />
          <input type="submit" value="Complete" className="common ghost" disabled={isInvalid()} />
        </footer>
      </form>
    </Dialog>
  );
}
