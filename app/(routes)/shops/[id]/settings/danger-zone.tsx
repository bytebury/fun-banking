"use client";

import { Dialog } from "@/app/components/dialog/Dialog";
import { MatIcon } from "@/app/components/icons/MatIcon";
import { useSnackbar } from "@/app/components/snackbar/snackbar-context";
import { DELETE } from "@/app/utils/http-client";
import { fetchBanks } from "@/lib/features/banks/banksSlice";
import { dialogsAction } from "@/lib/features/dialogs/dialogsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { Shop } from "@/lib/models/Shop";
import { useRouter } from "next/navigation";

type DangerZoneProps = { shop: Shop };

export function DangerZone({ shop }: DangerZoneProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const isDialogOpen = useAppSelector<any>((state) => state.dialogs.deleteShop);

  async function destroy(): Promise<void> {
    try {
      const response = await DELETE(`/shops/${shop.id}`);

      if (response.ok) {
        showSnackbar(`Successfully deleted ${shop.name}`);
        router.push("/dashboard");
        closeDialog();
        dispatch(fetchBanks());
      } else {
        const { message } = await response.json();
        showSnackbar(message);
      }
    } catch (error) {
      console.error(error);
    }
  }

  function openDeleteDialog(): void {
    dispatch(dialogsAction.toggleDeleteShop(true));
  }

  function closeDialog(): void {
    dispatch(dialogsAction.toggleDeleteShop(false));
  }

  return (
    <>
      <section
        id="Danger_Section"
        className="flex flex-col gap-2 rounded-[20px] bg-tertiary py-3 px-4"
      >
        <div>
          <h1>Danger Zone</h1>
          Anything you do in this section cannot be undone. Make sure that you know what you are
          doing.
        </div>
        <div>
          <button onClick={openDeleteDialog} className="common filled-error sm">
            Delete Shop
          </button>
        </div>
      </section>
      {isDialogOpen && (
        <Dialog>
          <header>
            <MatIcon icon="delete-outline" />
            <h1>Delete Shop?</h1>
          </header>
          <main className="flex flex-col gap-3">
            <p>
              Deleting this shop will <strong>permanently</strong> delete all associated data with
              it as well. This includes inventory.
            </p>
            <p>Are you sure you want to delete {shop.name}?</p>
          </main>
          <footer>
            <button className="common ghost" onClick={closeDialog}>
              Cancel
            </button>
            <button className="common ghost" onClick={destroy}>
              Delete Shop
            </button>
          </footer>
        </Dialog>
      )}
    </>
  );
}
