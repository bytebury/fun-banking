import { Dialog } from "@/app/components/dialog/Dialog";
import { MatIcon } from "@/app/components/icons/MatIcon";
import { useSnackbar } from "@/app/components/snackbar/snackbar-context";
import {
  INVALID_PIN_MESSAGE,
  hasErrors,
  isValidName,
  isValidPin,
} from "@/app/utils/form-validators";
import { PATCH, PUT } from "@/app/utils/http-client";
import { selectCurrentBank } from "@/lib/features/banks/banksSlice";
import {
  customerAction,
  fetchCustomers,
  selectCustomer,
} from "@/lib/features/customers/customerSlice";
import { dialogsAction } from "@/lib/features/dialogs/dialogsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { ChangeEvent, useState } from "react";

export function UpdateCustomerDialog() {
  const dispatch = useAppDispatch();
  const customer = useAppSelector(selectCustomer);
  const bank = useAppSelector(selectCurrentBank);
  const { showSnackbar } = useSnackbar();

  const [isDisabled, setIsDisabled] = useState(false);
  const [formData, setFormData] = useState({
    customerFirstName: customer?.first_name ?? "",
    customerLastName: customer?.last_name ?? "",
    customerPin: customer?.pin ?? "",
  });
  const [formErrors, setFormErrors] = useState({
    customerFirstName: "",
    customerLastName: "",
    customerPin: "",
  });

  type FormField = keyof typeof formData;

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    validateField(name as FormField, value);
  }

  function validateField(name: FormField, value: string): void {
    const errors = { ...formErrors };

    if (!value) {
      errors[name] = "";
      setFormErrors(errors);
      return;
    }

    switch (name) {
      case "customerFirstName":
      case "customerLastName":
        errors[name] = isValidName(value) ? "" : "Invalid name structure";
        break;
      case "customerPin":
        errors[name] = isValidPin(value) ? "" : INVALID_PIN_MESSAGE;
        break;
    }

    setFormErrors(errors);
  }

  function isInvalid(): boolean {
    return Object.values(formData).some((value) => !value) || hasErrors(formErrors);
  }

  async function updateCustomer(event: any) {
    event.preventDefault();

    setIsDisabled(true);

    const payload = {
      first_name: formData.customerFirstName,
      last_name: formData.customerLastName,
      pin: formData.customerPin,
    };

    try {
      const response = await PATCH(`/customers/${customer?.id}`, payload);

      if (response.ok) {
        closeDialog();
        dispatch(fetchCustomers(bank?.id ?? ""));
        showSnackbar("Successfully updated the customer");
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
    dispatch(customerAction.setCustomer(null));
    dispatch(dialogsAction.closeEditCustomer());
  }

  return (
    <Dialog>
      <header>
        <MatIcon icon="edit-outline" />
        <h1 className="capitalize">Update {customer?.first_name}?</h1>
      </header>
      <form className="flex flex-col gap-4" onSubmit={updateCustomer}>
        <main className="flex flex-col gap-2">
          <div className={`form-field ${formErrors.customerFirstName && "error"}`}>
            {" "}
            <label htmlFor="customerFirstName">First Name</label>
            <input
              className={`capitalize ${formErrors.customerFirstName && "error"}`}
              id="customerFirstName"
              name="customerFirstName"
              type="text"
              maxLength={20}
              autoComplete="off"
              defaultValue={formData.customerFirstName}
              onChange={handleChange}
            />
            <div className="error-message">{formErrors.customerFirstName}</div>
          </div>
          <div className={`form-field ${formErrors.customerLastName && "error"}`}>
            {" "}
            <label htmlFor="customerLastName">Last Name</label>
            <input
              className={`capitalize ${formErrors.customerLastName && "error"}`}
              id="customerLastName"
              name="customerLastName"
              type="text"
              autoComplete="off"
              maxLength={20}
              defaultValue={formData.customerLastName}
              onChange={handleChange}
            />
            <div className="error-message">{formErrors.customerLastName}</div>
          </div>
          <div className={`form-field ${formErrors.customerPin && "error"}`}>
            {" "}
            <label htmlFor="customerPin">PIN</label>
            <input
              className={formErrors.customerPin && "error"}
              id="customerPin"
              name="customerPin"
              type="text"
              autoComplete="off"
              inputMode="numeric"
              maxLength={6}
              defaultValue={formData.customerPin}
              onChange={handleChange}
            />
            <div className="error-message">{formErrors.customerPin}</div>
          </div>
        </main>
        <footer>
          <input type="reset" onClick={closeDialog} className="common ghost" value="Cancel" />
          <input
            type="submit"
            className="common ghost"
            value="Update"
            disabled={isInvalid() || isDisabled}
          />
        </footer>
      </form>
    </Dialog>
  );
}
