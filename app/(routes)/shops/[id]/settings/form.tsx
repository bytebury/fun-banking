import { useSnackbar } from "@/app/components/snackbar/snackbar-context";
import { hasErrors } from "@/app/utils/form-validators";
import { PUT } from "@/app/utils/http-client";
import { selectShop } from "@/lib/features/shops/shops.slice";
import { selectCurrentUser } from "@/lib/features/users/usersSlice";
import { useAppSelector } from "@/lib/hooks";
import { ShopRequest } from "@/lib/models/Shop";
import { ThunkStatus } from "@/lib/thunk";
import { useEffect, useState } from "react";

type Params = {
  type: "update" | "create";
  submitText: string;
  submitted: (shop_id: number) => void;
  cancelled?: () => void;
  submitClass: "filled" | "ghost";
};

export function ShopSettingsForm({ type, cancelled, submitText, submitted, submitClass }: Params) {
  const { showSnackbar } = useSnackbar();
  const shop = useAppSelector(selectShop);
  const user = useAppSelector(selectCurrentUser);

  const [disabled, setDisabled] = useState(false);
  const [formData, setFormData] = useState({
    shop_name: "",
    tax_rate: "",
  });
  const [formErrors, setFormErrors] = useState({
    shop_name: "",
    tax_rate: "",
  });

  useEffect(() => {
    if (shop.status === ThunkStatus.Success && type === "update") {
      setFormData({
        shop_name: shop.data.name,
        tax_rate: parseFloat(`${shop.data.tax_rate * 100}`).toFixed(2),
      });
    }
  }, [shop, type]);

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

  function isFormInvalid(): boolean {
    return Object.values(formData).some((value) => !value) || hasErrors(formErrors);
  }

  async function createShop(event: any): Promise<void> {
    event.preventDefault();

    setDisabled(true);

    try {
      const payload: ShopRequest = {
        id: (type === "update" && shop?.data?.id) || undefined,
        name: formData.shop_name,
        tax_rate: parseFloat(formData.tax_rate) / 100,
        user_id: user?.id ?? shop?.data?.user_id,
        items: [],
      };
      const response = await PUT("/shops", payload);

      if (response.ok) {
        const { id } = await response.json();
        submitted(id);
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
    <form className="flex flex-col gap-2" onSubmit={createShop}>
      <div className={`form-field && ${formErrors.shop_name && "form-error"}`}>
        <label htmlFor="shop_name">Shop Name</label>
        <input
          id="shop_name"
          name="shop_name"
          type="text"
          autoComplete="off"
          maxLength={50}
          value={formData.shop_name}
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
            step="0.01"
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
        {cancelled && (
          <input type="reset" value="Cancel" onClick={cancelled} className="common ghost" />
        )}
        <input
          type="submit"
          className={`common ${submitClass}`}
          value={`${submitText}`}
          disabled={isFormInvalid() || disabled}
        />
      </footer>
    </form>
  );
}
