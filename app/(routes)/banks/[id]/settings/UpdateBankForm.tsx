"use client";

import { useSnackbar } from "@/app/components/snackbar/snackbar-context";
import { INVALID_BANK_NAME_MESSAGE, hasErrors, isValidBankName } from "@/app/utils/form-validators";
import { PATCH } from "@/app/utils/http-client";
import { fetchBank, fetchBanks } from "@/lib/features/banks/banksSlice";
import { useAppDispatch } from "@/lib/hooks";
import { useState } from "react";

type UpdateBankFormProps = { bank: any };

export function UpdateBankForm({ bank }: UpdateBankFormProps) {
  const dispatch = useAppDispatch();
  const { showSnackbar } = useSnackbar();
  const [isDisabled, setIsDisabled] = useState(false);
  const [formData, setFormData] = useState({
    name: bank.name,
    description: bank.description,
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    description: "",
  });

  type FormField = keyof typeof formErrors;

  function handleChange(event: any) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  }

  function validateField(name: FormField, value: string) {
    const errors = { ...formErrors };

    if (!value) {
      errors[name] = "";
      setFormErrors(errors);
      return;
    }

    switch (name) {
      case "name":
        errors[name] = isValidBankName(value) ? "" : INVALID_BANK_NAME_MESSAGE;
        break;
      case "description":
        break;
    }

    setFormErrors(errors);
  }

  function isInvalid() {
    return Object.values(formData).some((value) => !value) || hasErrors(formErrors);
  }

  async function updateBank(event: any) {
    event.preventDefault();

    setIsDisabled(true);

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        // TODO: Move this logic to the backend..
        slug: formData.name.trim().toLowerCase().replaceAll(/\s+/g, "-"),
      };
      const response = await PATCH(`/banks/${bank.id}`, payload);

      if (response.ok) {
        showSnackbar("Successfully updated your bank information");
        dispatch(fetchBank(bank.id));
        dispatch(fetchBanks());
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

  return (
    <form className="flex flex-col gap-2" onSubmit={updateBank}>
      <div className={`form-field ${formErrors.name && "error"}`}>
        <label htmlFor="bankName">Name</label>
        <input
          id="bankName"
          name="name"
          type="text"
          onChange={handleChange}
          defaultValue={formData.name}
          required
          maxLength={30}
        />
        <div className="error-message">{formErrors.name}</div>
      </div>
      <div className={`form-field ${formErrors.description && "error"}`}>
        <label htmlFor="bankDescription">Description</label>
        <textarea
          id="bankDescription"
          name="description"
          onChange={handleChange}
          required
          maxLength={255}
          defaultValue={formData.description}
        ></textarea>
        <div className="error-message">{formErrors.description}</div>
      </div>
      <div>
        <input
          type="submit"
          className="common filled"
          disabled={isInvalid() || isDisabled}
          value="Update"
        />
      </div>
    </form>
  );
}
