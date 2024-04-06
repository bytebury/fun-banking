import { FeatureFlags, featureFlags } from "../feature-flags";

export const isFeatureOn = (feature: keyof FeatureFlags): boolean => {
  return featureFlags[feature] || false;
};
