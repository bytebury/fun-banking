import { Dialog } from "@/app/components/dialog/Dialog";
import { MatIcon } from "@/app/components/icons/MatIcon";
import { useSnackbar } from "@/app/components/snackbar/snackbar-context";
import { DELETE } from "@/app/utils/http-client";
import { dialogsAction } from "@/lib/features/dialogs/dialogsSlice";
import { itemsAction, selectCurrentItem } from "@/lib/features/items/items.slice";
import { fetchItems } from "@/lib/features/shops/shops.slice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

export function DeleteItemDialog() {
  const dispatch = useAppDispatch();
  const item = useAppSelector(selectCurrentItem);
  const { showSnackbar } = useSnackbar();

  function close(): void {
    dispatch(dialogsAction.toggleDeleteItem(false));
  }

  async function deleteItem(): Promise<void> {
    try {
      const response = await DELETE(`/items/${item?.id}`);

      if (response.ok) {
        close();
        showSnackbar(`Successfully deleted ${item?.name}`);
        dispatch(fetchItems(item?.shop_id.toString() ?? ""));
        dispatch(itemsAction.setItem(null));
      } else {
        const { message } = await response.json();
        showSnackbar(message);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Dialog>
      <header>
        <MatIcon icon="delete-outline" />
        <h1>Delete Item?</h1>
      </header>
      <main className="flex flex-col gap-2">
        <p>
          Deleting this item will delete all information regarding this item. You will not be able
          to undo this action.
        </p>
        <p>Are you sure?</p>
      </main>
      <footer className="flex items-center gap-1">
        <button className="ghost common" onClick={close}>
          Cancel
        </button>
        <button className="ghost common" onClick={deleteItem}>
          Delete Item
        </button>
      </footer>
    </Dialog>
  );
}
