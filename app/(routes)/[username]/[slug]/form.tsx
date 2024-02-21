"use client";

import { useSnackbar } from "@/app/components/snackbar/snackbar-context";
import { useCustomerAuth } from "@/app/guards/CustomerAuthContext";
import { POST } from "@/app/utils/http-client";
import { useState } from "react";

export function CustomerSignInForm({ bankId }: { bankId: string | number }) {
  const { signin } = useCustomerAuth();
  const { showSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    pin: "",
  });

  async function signIn(event: any): Promise<void> {
    event.preventDefault();

    try {
      const response = await POST(`/sessions/customers`, {
        bank_id: bankId.toString(),
        pin: formData.pin,
      });

      if (response.ok) {
        const { customer, token } = await response.json();
        signin(customer, token);
        showSnackbar("Successfully signed in to your account");
      } else {
        const { message } = await response.json();
        showSnackbar(message);
      }
    } catch (error) {
      console.error(error);
    }
  }

  function handleChange(event: any): void {
    const { name, value } = event.target;
    setFormData((formData) => ({ ...formData, [name]: value }));
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={signIn}>
      <div className={"form-field"}>
        <label htmlFor="pin">PIN</label>
        <input
          id="pin"
          name="pin"
          type="password"
          autoComplete="off"
          maxLength={6}
          inputMode="numeric"
          onChange={handleChange}
        />
      </div>
      <div className="flex gap-2">
        <input className="common filled" type="submit" value="Sign in" />
        <input className="common ghost" type="reset" value="Cancel" />
      </div>
    </form>
  );
}
