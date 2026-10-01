import { useEffect, useState } from 'react';
import type { Unsubscribe } from 'firebase/firestore';

export type Subscribe<Source, Result> = (source: Source, emit: (result: Result) => void) => Unsubscribe;

export interface SubscriptionStates<Result> {
  idle: Result;
  loading: Result;
}

interface SourceSnapshot<Source, Result> {
  source: Source;
  result: Result;
}

// `subscribe` must be a stable (module-level) function and `source` must be memoized
// by the caller, so the listener only restarts when the source really changes.
// A null source means "nothing to listen to yet" and yields the idle state.
export const useSubscription = <Source, Result>(
  source: Source | null,
  subscribe: Subscribe<Source, Result>,
  states: SubscriptionStates<Result>,
): Result => {
  const [snapshot, setSnapshot] = useState<SourceSnapshot<Source, Result> | null>(null);

  useEffect(() => {
    if (source === null) return undefined;
    return subscribe(source, (result) => setSnapshot({ source, result }));
  }, [source, subscribe]);

  if (source === null) return states.idle;
  return snapshot?.source === source ? snapshot.result : states.loading;
};
