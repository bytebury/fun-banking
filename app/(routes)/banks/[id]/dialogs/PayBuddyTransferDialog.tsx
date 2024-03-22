import { Dialog } from "@/app/components/dialog/Dialog";
import { MatIcon } from "@/app/components/icons/MatIcon";
import { Notice } from "@/app/components/notice/Notice";
import { useSnackbar } from "@/app/components/snackbar/snackbar-context";
import { AMOUNT_TOO_LARGE, hasErrors } from "@/app/utils/form-validators";
import { formatCurrency } from "@/app/utils/formatters";
import { GET, PUT } from "@/app/utils/http-client";
import { fetchAccount, selectAccount } from "@/lib/features/accounts/accountsSlice";
import {
  selectCustomers,
  fetchCustomers,
  selectCustomer,
} from "@/lib/features/customers/customerSlice";
import { dialogsAction } from "@/lib/features/dialogs/dialogsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { Customer } from "@/lib/models/Customer";
import { useEffect, useRef, useState } from "react";

export function PayBuddyTransferDialog() {
  const formRef = useRef<HTMLFormElement>(null);
  const customer = useAppSelector(selectCustomer);
  const account = useAppSelector(selectAccount);
  const [formData, setFormData] = useState({
    accountId: account.id,
    amount: "",
    description: "",
  });
  const [formErrors, setFormErrors] = useState({
    amount: "",
    description: "",
  });
  const { showSnackbar } = useSnackbar();

  const dispatch = useAppDispatch();
  const selectedCustomers = useAppSelector((state) => state.customers.selectedCustomers);
  const customers = useAppSelector(selectCustomers);
  const [recipients, setRecipients] = useState<Customer[]>([]);

  useEffect(() => {
    const fetchRecipients = async () => {
      try {
        const response = await GET(`/paybuddy/banks/${customer!.bank_id}/customers`);

        if (response.ok) {
          const recipientsData = await response.json();
          setRecipients(recipientsData);
        } else {
          showSnackbar("Something went wrong retrieving recipients");
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (recipients.length === 0 && customer) {
      fetchRecipients();
    }
  }, [recipients, customer, showSnackbar]);

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

  async function createTransfer(event: any): Promise<void> {
    event.preventDefault();

    const amount = parseFloat(formData.amount) * -1;
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
      dispatch(fetchAccount(formData.accountId));
    }
  }

  function close(): void {
    dispatch(fetchCustomers(customer!.bank_id));
    dispatch(dialogsAction.closePayBuddyTransfer());
  }

  return (
    <Dialog>
      <header>
        <MatIcon icon="send-money" />
        <h1>Send Money with PayBuddy</h1>
      </header>
      <Notice icon="warning-outline">
        Please double check your recipient. Once you send money, you cannot get it back.
      </Notice>
      <form ref={formRef} className="flex flex-col gap-3" onSubmit={createTransfer}>
        <main className="flex flex-col gap-2">
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
          <input type="reset" onClick={close} className="common ghost" value="Cancel" />
          <input type="submit" value="Send Money" className="common ghost" disabled={isInvalid()} />
        </footer>
      </form>
    </Dialog>
  );
}
