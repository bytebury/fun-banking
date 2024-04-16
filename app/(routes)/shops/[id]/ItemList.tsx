import { MatIcon } from "@/app/components/icons/MatIcon";
import { Notice } from "@/app/components/notice/Notice";
import PopoverMenu from "@/app/components/popovers/PopoverMenu";
import { formatCurrency } from "@/app/utils/formatters";
import { dialogsAction } from "@/lib/features/dialogs/dialogsSlice";
import { useAppDispatch } from "@/lib/hooks";
import { Item } from "@/lib/models/Item";
import { ThunkStatus } from "@/lib/thunk";

type Props = {
  items: { error: string; data: Item[]; status: ThunkStatus };
};
export function ItemList({ items }: Props) {
  const dispatch = useAppDispatch();

  function openCreateItemDialog(): void {
    dispatch(dialogsAction.toggleCreateItem(true));
  }

  if (items.status < ThunkStatus.Success) {
    return <div>Loading...</div>;
  }

  if (items.error) {
    return <div>{items.error}</div>;
  }

  if (items.data.length === 0) {
    return (
      <Notice icon="satellite-alt-outline" type="info">
        <div>
          This shop has no items. Want to{" "}
          <button
            onClick={openCreateItemDialog}
            className="inline font-semibold text-blue-800 underline"
          >
            create one
          </button>
          ?
        </div>
      </Notice>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="bg-gray-100 border py-2 px-3 rounded-t-2xl font-semibold">Item Details</div>
      {items.data.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between border border-t-0 last:rounded-b-2xl first:border-t py-2 px-3 hover:bg-slate-50"
        >
          <div className="flex flex-col">
            <div className="flex gap-2 items-center font-semibold">
              {item.name}
              <div className="pill bg-tonal w-fit text-xs">{formatCurrency(item.price)}</div>
            </div>
            <div>
              {item.number_in_stock ? (
                `${item.number_in_stock} in stock`
              ) : (
                <span className="text-rose-500">out of stock</span>
              )}
            </div>
          </div>
          <div className="w-fit">
            <PopoverMenu>
              <ul>
                <li>
                  <button>
                    <MatIcon icon="visibility-outline" />
                    View {item.name}
                  </button>
                </li>
                <li>
                  <button>
                    <MatIcon icon="edit-outline" />
                    Manage {item.name}
                  </button>
                </li>
                <hr />
                <li>
                  <button>
                    <MatIcon icon="delete-outline" />
                    Delete {item.name}
                  </button>
                </li>
              </ul>
            </PopoverMenu>
          </div>
        </div>
      ))}
    </div>
  );
}
