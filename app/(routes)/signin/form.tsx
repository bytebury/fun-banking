"use client";

import { useSnackbar } from "@/app/components/snackbar/snackbar-context";
import { AppConstants } from "@/app/constants/app-constants";
import { ErrorMessages } from "@/app/constants/error-messages";
import { useAuth } from "@/app/guards/AuthContext";
import { POST } from "@/app/utils/http-client";
import Link from "next/link";
import { ChangeEvent, useState } from "react";

export default function SignInForm() {
  const { signin } = useAuth();
  const { showSnackbar } = useSnackbar();

  const [formData, setFormData] = useState({
    username_or_email: "",
    password: "",
  });
  const formNameLabelMap = {
    username_or_email: "E-mail or Username",
    password: "Password",
  };
  const [isDisabled, setIsDisabled] = useState(false);

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  function isInvalid(): boolean {
    return Object.values(formData).some((value) => !value);
  }

  async function signUserIn(event: any): Promise<void> {
    event.preventDefault();
    setIsDisabled(true);

    try {
      const response = await POST(`/sessions/users`, formData);

      if (response.ok) {
        const { user, token } = await response.json();
        signin(user, token);
      } else {
        const { message } = await response.json();
        showSnackbar(message);
      }
    } catch (error) {
      console.error(error);
      showSnackbar(ErrorMessages.GENERIC, "Dismiss", 0);
    } finally {
      setIsDisabled(false);
    }
  }

  return (
    <form onSubmit={signUserIn} className="flex flex-col gap-2 my-4">
      <div className="flex">
        <div className="form-field">
          <label htmlFor="email">{formNameLabelMap.username_or_email}</label>
          <input
            id="username_or_email"
            type="text"
            name="username_or_email"
            placeholder={formNameLabelMap.username_or_email}
            inputMode="email"
            onChange={handleChange}
            autoFocus
            autoComplete="username"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="form-field">
          <label htmlFor="password">{formNameLabelMap.password}</label>
          <input
            id="password"
            type="password"
            name="password"
            autoComplete="password"
            placeholder={formNameLabelMap.password}
            onChange={handleChange}
          />
        </div>
        <div className="text-xs text-right">
          <Link href="/forgot">Forgot Password?</Link>
        </div>
      </div>
      <footer className="justify-start">
        <input
          type="submit"
          value="Sign in"
          className="common filled"
          disabled={isInvalid() || isDisabled}
        />
        <input type="reset" value="Cancel" className="common ghost" />
      </footer>
    </form>
  );
}
