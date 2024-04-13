"use client";

import { Dialog } from "@/app/components/dialog/Dialog";
import { MatIcon } from "@/app/components/icons/MatIcon";
import { useSnackbar } from "@/app/components/snackbar/snackbar-context";
import { hasErrors } from "@/app/utils/form-validators";
import { PUT } from "@/app/utils/http-client";
import { dialogsAction } from "@/lib/features/dialogs/dialogsSlice";
import { fetchShops } from "@/lib/features/shops/shops.slice";
import { useAppDispatch } from "@/lib/hooks";
import { ShopRequest } from "@/lib/models/Shop";
import { useState } from "react";

export function CreateShopDialog() {
  const dispatch = useAppDispatch();
  const { showSnackbar } = useSnackbar();

  const [disabled, setDisabled] = useState(false);
  const [formData, setFormData] = useState({
    shop_name: "",
    tax_rate: "",
  });
  const [formErrors, setFormErrors] = useState({
    shop_name: "",
    tax_rate: "",
  });

  function handleChange(event: any): void {
    const { name, value } = event.target;

    switch (name) {
      case "shop_name":
        if (!value?.trim()) {
          setFormErrors({ ...formErrors, [name]: "This is a required field" });
        } else {
          setFormErrors({ ...formErrors, [name]: "" });
        }
        break;
      case "tax_rate":
        validateTaxRate(value);
        break;
      default:
        break;
    }

    setFormData({ ...formData, [name]: value });
  }

  function formatTaxRate(): void {
    const taxRate = parseFloat(formData.tax_rate).toFixed(2);
    setFormData({ ...formData, tax_rate: taxRate });
  }

  function validateTaxRate(tax: string): void {
    if (!tax) {
      setFormErrors({ ...formErrors, tax_rate: "This is a required field" });
      return;
    }

    if (tax.match("[0-9]+.?[0-9]+?/g")?.length) {
      setFormErrors({ ...formErrors, tax_rate: "Must contain numbers only" });
      return;
    }

    if (parseInt(tax, 10) < 0) {
      setFormErrors({ ...formErrors, tax_rate: "Must be at least 0%" });
      return;
    }

    if (parseInt(tax, 10) > 50) {
      setFormErrors({ ...formErrors, tax_rate: "Cannot be greater than 50%" });
      return;
    }

    setFormErrors({ ...formErrors, tax_rate: "" });
  }

  function close(): void {
    dispatch(dialogsAction.toggleCreateShop(false));
  }

  function isFormInvalid(): boolean {
    return Object.values(formData).some((value) => !value) || hasErrors(formErrors);
  }

  async function createShop(event: any): Promise<void> {
    event.preventDefault();

    setDisabled(true);

    try {
      const payload: ShopRequest = {
        name: formData.shop_name,
        tax_rate: parseFloat(formData.tax_rate),
      };
      const response = await PUT("/shops", payload);

      if (response.ok) {
        const { id } = await response.json();
        // router.push(`/shops/${id}`);
        close();
        showSnackbar("Successfully created your new shop!");
        dispatch(fetchShops());
      } else {
        const { message } = await response.json();
        showSnackbar(message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setDisabled(false);
    }
  }

  return (
    <Dialog>
      <header>
        <MatIcon icon="add-business-outline" />
        <h1>Create a Shop</h1>
      </header>
      <main>
        <form className="flex flex-col gap-2" onSubmit={createShop}>
          <div className={`form-field && ${formErrors.shop_name && "form-error"}`}>
            <label htmlFor="shop_name">Shop Name</label>
            <input
              id="shop_name"
              name="shop_name"
              type="text"
              maxLength={50}
              onChange={handleChange}
              onBlur={handleChange}
            />
            <div className="form-error">{formErrors.shop_name}</div>
          </div>
          <div className={`form-field ${formErrors.tax_rate && "form-error"}`}>
            <label htmlFor="tax_rate">Tax Rate (%)</label>
            <div className="flex items-center gap-2">
              <input
                id="tax_rate"
                name="tax_rate"
                type="number"
                inputMode="decimal"
                onChange={handleChange}
                onBlur={(event) => {
                  handleChange(event);
                  formatTaxRate();
                }}
                value={formData.tax_rate}
                max={50}
                min={0}
              />
              <span className="font-bold text-lg">%</span>
            </div>
            <div className="form-error">{formErrors.tax_rate}</div>
          </div>
          <footer>
            <input type="reset" value="Cancel" onClick={close} className="common ghost" />
            <input
              type="submit"
              className="common ghost"
              value="Create Shop"
              disabled={isFormInvalid() || disabled}
            />
          </footer>
        </form>
      </main>
    </Dialog>
  );
}
