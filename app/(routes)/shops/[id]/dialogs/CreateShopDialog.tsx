"use client";

import { Dialog } from "@/app/components/dialog/Dialog";
import { MatIcon } from "@/app/components/icons/MatIcon";
import { dialogsAction } from "@/lib/features/dialogs/dialogsSlice";
import { useAppDispatch } from "@/lib/hooks";
import { ShopSettingsForm } from "../settings/form";
import { useRouter } from "next/navigation";
import { useSnackbar } from "@/app/components/snackbar/snackbar-context";
import { fetchShop } from "@/lib/features/shops/shops.slice";

export function CreateShopDialog() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  function close(): void {
    dispatch(dialogsAction.toggleCreateShop(false));
  }

  function shopCreated(id: number) {
    showSnackbar("Successfully created your shop!");
    router.push(`/shops/${id}`);
    dispatch(fetchShop(id.toString()));
    close();
  }

  return (
    <Dialog>
      <header>
        <MatIcon icon="add-business-outline" />
        <h1>Create a Shop</h1>
      </header>
      <main>
        <ShopSettingsForm
          type="create"
          submitClass="ghost"
          submitText="Create Shop"
          submitted={shopCreated}
          cancelled={close}
        />{" "}
      </main>
    </Dialog>
  );
}
