"use client";

import { Icon as Iconify } from "@iconify/react";

export type Icon =
  | "menu"
  | "home-outline"
  | "add"
  | "rocket-launch-outline"
  | "savings-outline"
  | "favorite"
  | "diversity-3"
  | "checkbook-outline"
  | "person-play-outline"
  | "join-outline"
  | "person-add-outline"
  | "account-circle"
  | "logout"
  | "dashboard-outline"
  | "inactive-order-outline"
  | "waving-hand-outline"
  | "settings-outline"
  | "content-paste"
  | "inventory"
  | "error-outline"
  | "more-vert"
  | "visibility-outline"
  | "payments-outline"
  | "edit-outline"
  | "delete-outline"
  | "price-change-outline"
  | "groups-outline"
  | "paid-outline"
  | "calendar-month-outline"
  | "check"
  | "shield-outline"
  | "admin-panel-settings-outline"
  | "settings-account-box-outline"
  | "security"
  | "wallet"
  | "password"
  | "arrow-back"
  | "brand-awareness-outline"
  | "warning-outline"
  | "terminal"
  | "analytics-outline"
  | "manage-accounts-outline"
  | "share-windows";

type MatIconParams = {
  icon: Icon;
  className?: string;
  width?: number;
  height?: number;
};

export function MatIcon({ icon, className, width, height }: MatIconParams) {
  return (
    <Iconify
      className={className}
      icon={`material-symbols:${icon}`}
      width={width ?? 24}
      height={height ?? 24}
    />
  );
}
