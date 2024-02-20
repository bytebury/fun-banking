import { Dialog } from "@/app/components/dialog/Dialog";
import { MatIcon } from "@/app/components/icons/MatIcon";
import { useSnackbar } from "@/app/components/snackbar/snackbar-context";
import {
  INVALID_NAME_MESSAGE,
  INVALID_PIN_MESSAGE,
  hasErrors,
  isValidName,
  isValidPin,
} from "@/app/utils/form-validators";
import { POST, PUT } from "@/app/utils/http-client";
import { selectCurrentBank } from "@/lib/features/banks/banksSlice";
import { fetchCustomers } from "@/lib/features/customers/customerSlice";
import { dialogsAction } from "@/lib/features/dialogs/dialogsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useState } from "react";

export function AddCustomerDialog() {
  const dispatch = useAppDispatch();
  const bank = useAppSelector(selectCurrentBank);
  const { showSnackbar } = useSnackbar();

  const [isDisabled, setIsDisabled] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    pin: "",
  });
  const [formErrors, setFormErrors] = useState({
    firstName: "",
    lastName: "",
    pin: "",
  });

  type FormField = keyof typeof formData;

  function handleChange(event: any) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
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
      case "firstName":
      case "lastName":
        errors[name] = isValidName(value) ? "" : `Names ${INVALID_NAME_MESSAGE}`;
        break;
      case "pin":
        errors[name] = isValidPin(value) ? "" : INVALID_PIN_MESSAGE;
        break;
    }

    setFormErrors(errors);
  }

  function isInvalid() {
    return Object.values(formData).some((value) => !value) || hasErrors(formErrors);
  }

  async function createCustomer(event: any) {
    event.preventDefault();

    setIsDisabled(true);

    try {
      const payload = {
        bank_id: bank!.id,
        first_name: formData.firstName,
        last_name: formData.lastName,
        pin: formData.pin,
      };
      const response = await PUT("/customers", payload);

      if (response.ok) {
        closeDialog();
        dispatch(fetchCustomers(bank!.id));
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
    dispatch(dialogsAction.closeAddCustomerDialog());
  }

  return (
    <Dialog>
      <header>
        <MatIcon icon="person-add-outline" />
        <h1>Add a Customer</h1>
      </header>
      <form onSubmit={createCustomer} className="flex flex-col gap-4">
        <main>
          <div className={`form-field ${formErrors.firstName && "error"}`}>
            <label htmlFor="customerFirstName">First Name</label>
            <input
              id="customerFirstName"
              name="firstName"
              className="capitalize"
              type="text"
              onChange={handleChange}
              autoComplete="off"
              required
              maxLength={20}
            />
            <div className="error-message">{formErrors.firstName}</div>
          </div>
          <div className={`form-field ${formErrors.lastName && "error"}`}>
            <label htmlFor="customerLastName">Last Name</label>
            <input
              id="customerLastName"
              name="lastName"
              className="capitalize"
              type="text"
              autoComplete="off"
              onChange={handleChange}
              required
              maxLength={20}
            />
            <div className="error-message">{formErrors.lastName}</div>
          </div>
          <div className={`form-field ${formErrors.pin && "error"}`}>
            <label htmlFor="customerPin">PIN</label>
            <input
              id="customerPin"
              name="pin"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              onChange={handleChange}
              maxLength={6}
              required
            />
            <div className="error-message">{formErrors.pin}</div>
          </div>
        </main>
        <footer>
          <input type="reset" onClick={closeDialog} className="common ghost" value="Cancel" />
          <input
            type="submit"
            value="Create Customer"
            className="common ghost"
            disabled={isInvalid() || isDisabled}
          />
        </footer>
      </form>
    </Dialog>
  );
}
