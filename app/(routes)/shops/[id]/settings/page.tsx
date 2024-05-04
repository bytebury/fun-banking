"use client";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { ShopSettingsForm } from "./form";
import { fetchShop, selectShop } from "@/lib/features/shops/shops.slice";
import { DangerZone } from "./danger-zone";

export default function ShopSettingsPage() {
  const dispatch = useAppDispatch();
  const shop = useAppSelector(selectShop);

  function getShop(id: number) {
    dispatch(fetchShop(id.toString()));
  }

  return (
    <section className="flex flex-col gap-4">
      <ShopSettingsForm
        type="update"
        submitted={getShop}
        submitClass="filled"
        submitText="Update"
      />
      <hr />
      <DangerZone shop={shop.data} />
    </section>
  );
}
