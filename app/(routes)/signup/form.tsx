"use client";

import { useSnackbar } from "@/app/components/snackbar/snackbar-context";
import { ErrorMessages } from "@/app/constants/error-messages";
import {
  INVALID_EMAIL_MESSAGE,
  INVALID_NAME_MESSAGE,
  INVALID_PASSWORD_MESSAGE,
  INVALID_USERNAME_MESSAGE,
  hasErrors,
  isTheSame,
  isValidEmail,
  isValidName,
  isValidPassword,
  isValidUsername,
} from "@/app/utils/form-validators";
import { POST, PUT } from "@/app/utils/http-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";

export default function SignUpForm() {
  const { showSnackbar } = useSnackbar();
  const router = useRouter();
  const [isDisabled, setIsDisabled] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    passwordConfirmation: "",
  });
  const [formErrors, setFormErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    passwordConfirmation: "",
  });
  const formNameLabelMap = {
    firstName: "First Name",
    lastName: "Last Name",
    email: "E-mail",
    username: "Username",
    password: "Password",
    passwordConfirmation: "Password",
  };

  type FormField = keyof typeof formData;

  async function createAccount(event: any): Promise<void> {
    event.preventDefault();
    setIsDisabled(true);

    if (formData.password !== formData.passwordConfirmation) {
      setFormErrors({ ...formErrors, passwordConfirmation: "Passwords do not match " });
      setIsDisabled(false);
      return;
    }

    try {
      const response = await PUT(`/users`, {
        username: formData.username,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.passwordConfirmation,
      });

      if (response.ok) {
        router.push("/signin");
        showSnackbar(
          "Successfully created your account! You can now sign in.",
          "Welcome to Fun Banking! 🎉"
        );
        return;
      }

      const json = await response.json();
      showSnackbar(json.message, "Dismiss");
    } catch (error) {
      console.error(error);
      showSnackbar(ErrorMessages.GENERIC, "Dismiss", 0);
    } finally {
      setIsDisabled(false);
    }
  }

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
      case "firstName":
      case "lastName":
        errors[name] = isValidName(value)
          ? ""
          : `${formNameLabelMap[name]} ${INVALID_NAME_MESSAGE}`;
        break;
      case "username":
        errors[name] = isValidUsername(value)
          ? ""
          : `${formNameLabelMap[name]} ${INVALID_USERNAME_MESSAGE}`;
        break;
      case "email":
        errors[name] = isValidEmail(value)
          ? ""
          : `${formNameLabelMap[name]} ${INVALID_EMAIL_MESSAGE}`;
        break;
      case "password":
        errors[name] = isValidPassword(value)
          ? ""
          : `${formNameLabelMap[name]} ${INVALID_PASSWORD_MESSAGE}`;
        break;
      case "passwordConfirmation":
        errors[name] = isTheSame(value, formData.password)
          ? ""
          : `${formNameLabelMap[name]} does not match password`;
        break;
      default:
        break;
    }

    setFormErrors(errors);
  }

  function isInvalid(): boolean {
    return Object.values(formData).some((value) => !value) || hasErrors(formErrors);
  }

  return (
    <form onSubmit={createAccount} className="flex flex-col gap-2 my-4">
      <div className="flex gap-4">
        <div className={`form-field ${formErrors.firstName && "error"}`}>
          <label htmlFor="first_name">First Name</label>
          <input
            id="first_name"
            name="firstName"
            type="text"
            className="capitalize"
            placeholder="First Name"
            autoFocus
            autoComplete="given-name"
            maxLength={20}
            onChange={handleChange}
            required
          />
          <div className="error-message">{formErrors.firstName}</div>
        </div>
        <div className={`form-field ${formErrors.lastName && "error"}`}>
          {" "}
          <label htmlFor="last_name">Last Name</label>
          <input
            id="last_name"
            name="lastName"
            type="text"
            className="capitalize"
            placeholder="Last Name"
            autoComplete="family-name"
            maxLength={20}
            onChange={handleChange}
            required
          />
          <div className="error-message">{formErrors.lastName}</div>
        </div>
      </div>
      <div className="flex">
        <div className={`form-field ${formErrors.email && "error"}`}>
          {" "}
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="Email Address"
            onChange={handleChange}
            required
          />
          <div className="error-message">{formErrors.email}</div>
        </div>
      </div>
      <div className="flex">
        <div className={`form-field ${formErrors.username && "error"}`}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            placeholder="Username"
            onChange={handleChange}
            required
            maxLength={12}
          />
          <div className="error-message">{formErrors.username}</div>
        </div>
      </div>
      <div className="flex">
        <div className={`form-field ${formErrors.password && "error"}`}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="password"
            placeholder="Password"
            onChange={handleChange}
            minLength={6}
          />
          <div className="error-message">{formErrors.password}</div>
        </div>
      </div>
      <div className="flex">
        <div className={`form-field ${formErrors.passwordConfirmation && "error"}`}>
          <label htmlFor="password_confirmation">Confirm Password</label>
          <input
            id="password_confirmation"
            name="passwordConfirmation"
            type="password"
            autoComplete="password"
            placeholder="Confirm Password"
            onChange={handleChange}
            minLength={6}
          />
          <div className="error-message">{formErrors.passwordConfirmation}</div>
        </div>
      </div>
      <footer className="justify-start mt-2">
        <input
          type="submit"
          value="Create Account"
          className="common filled"
          disabled={isInvalid() || isDisabled}
        />
        <input type="reset" value="Cancel" className="common ghost" />
      </footer>
    </form>
  );
}
