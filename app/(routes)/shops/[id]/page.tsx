"use client";

import { selectItems, selectShop } from "@/lib/features/shops/shops.slice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { ThunkStatus } from "@/lib/thunk";
import { ItemList } from "./ItemList";
import { MatIcon } from "@/app/components/icons/MatIcon";
import { dialogsAction, selectDialogs } from "@/lib/features/dialogs/dialogsSlice";
import { CreateItemDialog } from "../../dialogs/CreateItemDialog";

export default function ShopsPage() {
  const dispatch = useAppDispatch();
  const dialogs = useAppSelector(selectDialogs);
  const shop = useAppSelector(selectShop);
  const items = useAppSelector(selectItems);

  function openCreateItemDialog(): void {
    dispatch(dialogsAction.toggleCreateItem(true));
  }

  if (shop.status < ThunkStatus.Success) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex justify-end">
          <button onClick={openCreateItemDialog} className="common filled sm">
            <MatIcon icon="add" /> Create Item
          </button>
        </div>
        <ItemList items={items}></ItemList>
      </div>
      {dialogs.createItem && <CreateItemDialog />}
    </>
  );
}
