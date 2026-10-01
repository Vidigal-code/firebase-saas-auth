import { SCHEDULED_DISPATCH_ENABLED } from './env';

export interface FeatureFlags {
  // Cloud Function dispatchScheduledMessages is deployed and flips scheduled messages to sent.
  scheduledDispatch: boolean;
}

export const FEATURES: FeatureFlags = {
  scheduledDispatch: SCHEDULED_DISPATCH_ENABLED,
};
