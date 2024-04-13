import { SubscriptionTier } from "@/lib/models/User";

export enum Role {
  Default,
  Admin = 10,
}

type bankLimits = {
  banks: number;
  employees: number;
  customers: number;
  accounts: number;
  shops: number;
};

export type FeatureFlags = {
  ads: boolean;
  account_transfers: boolean;
  shops: boolean;
};

export type BankConfig = {
  features: FeatureFlags;
  limits: {
    [SubscriptionTier.Free]: bankLimits;
    [SubscriptionTier.Premium]: bankLimits;
    [SubscriptionTier.Organization]: bankLimits;
  };
};
