export type User = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  role: UserRole;
  avatar: string;
  about: string;
  last_seen?: Date;
  created_at: Date | string;
  updated_at: Date | string;
  verified: boolean;
  subscription_tier: SubscriptionTier;
};

export enum UserRole {
  Normal,
  Admin = 10,
}

export enum SubscriptionTier {
  Free,
  Premium,
  Organization,
}
