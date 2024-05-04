"use client";

import { useAppDispatch } from "@/lib/hooks";
import { ShopSettingsForm } from "./form";
import { fetchShop } from "@/lib/features/shops/shops.slice";

export default function ShopSettingsPage() {
  const dispatch = useAppDispatch();

  function getShop(id: number) {
    dispatch(fetchShop(id.toString()));
  }
  return (
    <section>
      <ShopSettingsForm
        type="update"
        submitted={getShop}
        submitClass="filled"
        submitText="Update"
      />
    </section>
  );
}
