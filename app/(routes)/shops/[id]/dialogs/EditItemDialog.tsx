import { Dialog } from "@/app/components/dialog/Dialog";
import { MatIcon } from "@/app/components/icons/MatIcon";
import { useSnackbar } from "@/app/components/snackbar/snackbar-context";
import { hasErrors } from "@/app/utils/form-validators";
import { formatCurrency } from "@/app/utils/formatters";
import { PATCH } from "@/app/utils/http-client";
import { dialogsAction } from "@/lib/features/dialogs/dialogsSlice";
import { selectCurrentItem } from "@/lib/features/items/items.slice";
import { fetchItems } from "@/lib/features/shops/shops.slice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useState } from "react";

export function EditItemDialog() {
  const dispatch = useAppDispatch();
  const item = useAppSelector(selectCurrentItem);

  const { showSnackbar } = useSnackbar();

  const [formData, setFormData] = useState({
    id: item?.id ?? 0,
    shop_id: item?.shop_id ?? 0,
    name: item?.name ?? "",
    description: item?.description ?? "",
    price: formatCurrency(convertToPrice(item?.price.toString() ?? "")),
    number_in_stock: item?.number_in_stock.toString() ?? "",
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    description: "",
    price: "",
    number_in_stock: "",
  });
  const [disabled, setDisabled] = useState(false);

  function handleChange(event: any): void {
    const { name, value } = event.target;

    setFormData({ ...formData, [name]: value });
    validate(name, value);
  }

  function validate(name: string, value: any): void {
    const errors = { ...formErrors };

    switch (name) {
      case "name":
        if (value.trim().length === 0) {
          errors[name] = "This field is required";
        } else if (value.length > 20) {
          errors[name] = "Max character length is 20";
        } else {
          errors[name] = "";
        }
        break;
      case "description":
        if (value.trim().length === 0) {
          errors[name] = "This field is required";
        } else {
          errors[name] = "";
        }
        break;
      case "price":
        const price = convertToPrice(value);

        if (isNaN(price)) {
          errors[name] = "Must be a valid number";
          setFormData({ ...formData, price: "" });
        } else if (price < 0) {
          errors[name] = "You cannot have negative values";
        } else {
          errors[name] = "";
        }

        break;
      case "number_in_stock":
        const inStock = parseInt(value);
        if (isNaN(inStock)) {
          errors[name] = "Please enter a valid number";
          setFormData({ ...formData, number_in_stock: "" });
        } else if (inStock < 0) {
          errors[name] = "Must be greater than or equal to 0";
        } else {
          errors[name] = "";
        }
        break;
    }

    setFormErrors(errors);
  }

  function isInvalid(): boolean {
    return Object.values(formData).some((value) => !value) || hasErrors(formErrors);
  }

  function convertToPrice(value: string): number {
    return parseFloat(value.replace(/[^\d.]/g, ""));
  }

  function formatPrice(): void {
    const price = formatCurrency(convertToPrice(formData.price));

    if (price.toLowerCase().includes("nan")) {
      setFormErrors({ ...formErrors, price: "Invalid number format" });
      setFormData({ ...formData, price: "" });
      return;
    }

    if (!formErrors.price) {
      setFormData({ ...formData, price });
    }
  }

  function formatStock(): void {
    const inStock = parseInt(formData.number_in_stock);

    if (isNaN(inStock)) {
      setFormData({ ...formData, number_in_stock: "" });
      return;
    }

    setFormData({ ...formData, number_in_stock: inStock.toString() });
  }

  async function updateItem(event: any): Promise<void> {
    event.preventDefault();

    try {
      setDisabled(true);
      const response = await PATCH(`/items`, {
        ...formData,
        number_in_stock: parseInt(formData.number_in_stock),
        price: convertToPrice(formData.price),
      });

      if (response.ok) {
        dispatch(fetchItems(item?.shop_id.toString() ?? ""));
        close();
        showSnackbar(`Successfully updated your item`);
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

  function close(): void {
    dispatch(dialogsAction.toggleEditItem(false));
  }

  return (
    <Dialog>
      <header>
        <MatIcon icon="edit-outline" />
        <h1>Edit {item?.name}</h1>
      </header>
      <main>
        <form className="flex flex-col gap-2" onSubmit={updateItem}>
          <div className={`form-field ${formErrors.name && "form-error"}`}>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              autoComplete="off"
              maxLength={20}
              onChange={handleChange}
            />
            <div className="form-error">{formErrors.name}</div>
          </div>
          <div className={`form-field ${formErrors.description && "form-error"}`}>
            <label htmlFor="description">Description</label>
            <input
              id="description"
              name="description"
              type="text"
              value={formData.description}
              autoComplete="off"
              maxLength={255}
              onChange={handleChange}
            />
            <div className="form-error">{formErrors.description}</div>
          </div>
          <div className={`form-field ${formErrors.price && "form-error"}`}>
            <label htmlFor="price">Price</label>
            <input
              id="price"
              name="price"
              type="text"
              autoComplete="off"
              maxLength={6}
              inputMode="decimal"
              value={formData.price}
              onChange={handleChange}
              onBlur={formatPrice}
            />
            <div className="form-error">{formErrors.price}</div>
          </div>
          <div className={`form-field ${formErrors.number_in_stock && "form-error"}`}>
            <label htmlFor="number_in_stock">Number In Stock</label>
            <input
              id="number_in_stock"
              name="number_in_stock"
              type="text"
              autoComplete="off"
              maxLength={5}
              inputMode="numeric"
              value={formData.number_in_stock}
              onChange={handleChange}
              onBlur={formatStock}
            />
            <div className="form-error">{formErrors.number_in_stock}</div>
          </div>
          <footer>
            <button className="common ghost" onClick={close}>
              Cancel
            </button>
            <input
              disabled={isInvalid() || disabled}
              className="common ghost"
              type="submit"
              value="Update Item"
            />
          </footer>
        </form>
      </main>
    </Dialog>
  );
}