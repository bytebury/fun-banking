"use client";

import { Dialog } from "@/app/components/dialog/Dialog";
import { MatIcon } from "@/app/components/icons/MatIcon";
import { useSnackbar } from "@/app/components/snackbar/snackbar-context";
import { INVALID_BANK_NAME_MESSAGE, hasErrors, isValidBankName } from "@/app/utils/form-validators";
import { POST, PUT } from "@/app/utils/http-client";
import { fetchBanks } from "@/lib/features/banks/banksSlice";
import { dialogsAction } from "@/lib/features/dialogs/dialogsSlice";
import { useAppDispatch } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function CreateBankDialog() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { showSnackbar } = useSnackbar();
  const [isDisabled, setIsDisabled] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [formErrors, setFormErrors] = useState({ name: "", description: "" });

  type FormField = keyof typeof formData;

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
    }

    setFormErrors(errors);
  }

  function isInvalid() {
    return Object.values(formData).some((value) => !value) || hasErrors(formErrors);
  }

  function close() {
    dispatch(dialogsAction.closeCreateBankDialog());
  }

  async function createBank(event: any) {
    event.preventDefault();

    setIsDisabled(true);

    try {
      const payload = {
        ...formData,
        // TODO: Move this logic to the backend..
        slug: formData.name.trim().toLowerCase().replaceAll(/\s+/g, "-"),
      };
      const response = await PUT("/banks", payload);

      if (response.ok) {
        const { id } = await response.json();
        router.push(`/banks/${id}`);
        close();
        showSnackbar("Successfully created a new bank!");
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
    <Dialog>
      <header>
        <MatIcon icon="savings-outline" />
        <h1>Create a Bank</h1>
      </header>
      <main>
        <form className="flex flex-col gap-2" onSubmit={createBank}>
          <div className={`form-field ${formErrors.name && "error"}`}>
            <label htmlFor="create_bank_form_name">Bank Name</label>
            <input
              id="create_bank_form_name"
              name="name"
              type="text"
              placeholder="Bank Name"
              onChange={handleChange}
              maxLength={20}
              required
            />
            <div className="error-message">{formErrors.name}</div>
          </div>
          <div className={`form-field`}>
            <label htmlFor="create_bank_form_description">Description</label>
            <textarea
              id="create_bank_form_description"
              className="w-full md:w-96 max-h-[200px]"
              name="description"
              placeholder="Description"
              onChange={handleChange}
              maxLength={255}
              required
            ></textarea>
          </div>
          <footer>
            <input type="reset" value="Cancel" onClick={close} className="common ghost" />
            <input
              type="submit"
              className="common ghost"
              value="Create Bank"
              disabled={isInvalid() || isDisabled}
            />
          </footer>
        </form>
      </main>
    </Dialog>
  );
}
