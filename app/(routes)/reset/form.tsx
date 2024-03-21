"use client";

import { useSnackbar } from "@/app/components/snackbar/snackbar-context";
import {
  INVALID_PASSWORD_MESSAGE,
  hasErrors,
  isTheSame,
  isValidPassword,
} from "@/app/utils/form-validators";
import { POST } from "@/app/utils/http-client";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, Suspense, useState } from "react";

export default function ResetPasswordForm() {
  type FormField = keyof typeof formFieldLabelMap;

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const { showSnackbar } = useSnackbar();
  const [isDisabled, setIsDisabled] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    passwordConfirmation: "",
  });
  const [formErrors, setFormErrors] = useState({
    password: "",
    passwordConfirmation: "",
  });
  const formFieldLabelMap = {
    password: "Password",
    passwordConfirmation: "Password Confirmation",
  };

  async function resetPassword(event: any): Promise<void> {
    event.preventDefault();
    setIsDisabled(true);

    if (formData.password !== formData.passwordConfirmation) {
      setFormErrors({ ...formErrors, passwordConfirmation: "Passwords are not the same" });
      setIsDisabled(false);
      return;
    }

    try {
      const request = {
        password: formData.password,
        password_confirmation: formData.passwordConfirmation,
        token,
      };
      const response = await POST(`/passwords/reset`, request);

      if (response.ok) {
        router.push("/signin");
        showSnackbar("Your password has been reset! You may now sign in using the new password");
        return;
      }

      const json = await response.json();
      showSnackbar(json.message);
    } catch (error) {
      console.error(error);
    } finally {
      setIsDisabled(false);
    }
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    validatePasswords(name as FormField, value);
  }

  function isInvalid(): boolean {
    return Object.values(formData).some((value) => !value) || hasErrors(formErrors);
  }

  function validatePasswords(name: FormField, value: string): void {
    const errors = { ...formErrors };

    switch (name) {
      case "password":
        errors[name] = isValidPassword(value)
          ? ""
          : `${formFieldLabelMap[name]} ${INVALID_PASSWORD_MESSAGE}`;
        break;
      case "passwordConfirmation":
        errors[name] = isTheSame(value, formData.password) ? "" : "Passwords are not the same";
        break;
      default:
        break;
    }

    setFormErrors(errors);
  }

  return (
    <Suspense>
      <form onSubmit={resetPassword} className="flex flex-col gap-2 my-4">
        <div className="flex flex-col gap-2">
          <div className={`form-field ${formErrors.password && "error"}`}>
            {" "}
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              autoFocus
              autoComplete="password"
            />
            <div className="error-message">{formErrors.password}</div>
          </div>
          <div className={`form-field ${formErrors.passwordConfirmation && "error"}`}>
            <label htmlFor="password">Password Confirmation</label>
            <input
              id="passwordConfirmation"
              type="password"
              name="passwordConfirmation"
              placeholder="Password Confirmation"
              onChange={handleChange}
              autoFocus
              autoComplete="password"
            />
            <div className="error-message">{formErrors.passwordConfirmation}</div>
          </div>
        </div>
        <footer className="justify-start my-2">
          <input
            type="submit"
            value="Reset Password"
            className="common filled"
            disabled={isInvalid() || isDisabled}
          />
          <input type="reset" value="Cancel" className="common ghost" />
        </footer>
      </form>
    </Suspense>
  );
}
