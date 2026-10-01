import { useCallback, useState } from 'react';

export type ActionOutcome<R> = { ok: true; value: R } | { ok: false; error: unknown };

interface ActionState {
  isPending: boolean;
  error: unknown;
}

const IDLE: ActionState = { isPending: false, error: null };

export interface AsyncAction<Args extends unknown[], R> extends ActionState {
  run: (...args: Args) => Promise<ActionOutcome<R>>;
  reset: () => void;
}

export const useAsyncAction = <Args extends unknown[], R>(
  action: (...args: Args) => Promise<R>,
): AsyncAction<Args, R> => {
  const [state, setState] = useState<ActionState>(IDLE);

  const run = useCallback(
    async (...args: Args): Promise<ActionOutcome<R>> => {
      setState({ isPending: true, error: null });
      try {
        const value = await action(...args);
        setState(IDLE);
        return { ok: true, value };
      } catch (error) {
        setState({ isPending: false, error });
        return { ok: false, error };
      }
    },
    [action],
  );

  const reset = useCallback(() => setState(IDLE), []);

  return { ...state, run, reset };
};
