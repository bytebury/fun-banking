"use client";

import { Card } from "@/app/components/card/Card";
import { Tabs, TabsInfo } from "@/app/components/tabs/Tabs";
import { fetchShop, selectShop } from "@/lib/features/shops/shops.slice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ShopHeader } from "./ShopHeader";
import { ThunkStatus } from "@/lib/thunk";
import { Notice } from "@/app/components/notice/Notice";

export default function ShopsLayout({ children }: any) {
  const dispatch = useAppDispatch();
  const params = useParams();
  const [tabs, setTabs] = useState<TabsInfo[]>([]);
  const shop = useAppSelector(selectShop);

  useEffect(() => {
    if (shop && shop.error) {
      return;
    }

    if (!shop || `${shop.data.id}` !== params.id) {
      dispatch(fetchShop(params.id as string));
    }
  }, [dispatch, shop, params]);

  useEffect(() => {
    setTabs([
      { link: `/shops/${params.id}`, displayText: "Inventory" },
      { link: `/shops/${params.id}/settings`, displayText: "Settings" },
    ]);
  }, [params]);

  function displayHeader() {
    if (shop.status < ThunkStatus.Success) {
      return <div>Loading...</div>;
    }

    return <ShopHeader shop={shop.data} />;
  }

  if (shop.error) {
    return (
      <main className="container">
        <Notice icon="error-outline">{shop.error}</Notice>
      </main>
    );
  }

  return (
    <main className="container">
      <div className="flex flex-col gap-4 w-full">
        <Card className="flex flex-col gap-4 w-full" type="outlined">
          {displayHeader()}
          <Tabs tabs={tabs}>{children}</Tabs>
        </Card>
      </div>
    </main>
  );
}
