"use client";

import { MatIcon } from "@/app/components/icons/MatIcon";
import { dialogsAction } from "@/lib/features/dialogs/dialogsSlice";
import { fetchShops, selectAllShops } from "@/lib/features/shops/shops.slice";
import { selectCurrentUser } from "@/lib/features/users/usersSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { SubscriptionTier } from "@/lib/models/User";
import { ThunkStatus } from "@/lib/thunk";
import Link from "next/link";
import { useEffect } from "react";

export function ShopList() {
  const dispatch = useAppDispatch();
  const shops = useAppSelector(selectAllShops);
  const user = useAppSelector(selectCurrentUser);

  useEffect(() => {
    dispatch(fetchShops());
  }, [dispatch]);

  function openCreateShopDialog(): void {
    dispatch(dialogsAction.toggleCreateShop(true));
  }

  if (shops.status === ThunkStatus.Loading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 2 }).map((_, index) => {
          return (
            <div key={index} className="flex items-center gap-2">
              <div className="shimmer w-6 h-6 rounded-full bg-gray-100 shrink-0"></div>
              <div className="shimmer w-full h-6 bg-gray-100 rounded-full"></div>
            </div>
          );
        })}
      </div>
    );
  }

  if ((user?.subscription_tier ?? 0) < SubscriptionTier.Premium) {
    return (
      <div className="flex flex-col gap-2 text-gray-600 text-sm">
        This feature is only allowed for premium users.
        <div>
          <Link className="premium-link" href={"dashboard"}>
            Upgrade to Premium Today
          </Link>
        </div>
      </div>
    );
  }

  if (shops.status <= ThunkStatus.Success && shops.data.length === 0) {
    return (
      <div className="text-gray-600 text-sm">
        It seems like you don&apos;t have any shops yet. Do you want to{" "}
        <button onClick={openCreateShopDialog} className="inline text-primary underline">
          create one
        </button>
        ?
      </div>
    );
  }

  return (
    <div>
      {shops.data.map((shop) => {
        return (
          <div className="flex gap-1.5 items-center" key={shop.id}>
            <MatIcon icon="storefront-outline" className="text-primary shrink-0" />
            <div className="whitespace-nowrap text-ellipsis overflow-hidden text-sm">
              <Link href={`shops/${shop.id}`}>{shop.name}</Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
