import { useCallback, useState } from 'react';

// Tracks a dialog that either creates a new item (target = null) or edits one.
export type EditorState<T> = { open: false } | { open: true; target: T | null };

export interface Editor<T> {
  state: EditorState<T>;
  openCreate: () => void;
  openEdit: (target: T) => void;
  close: () => void;
}

const CLOSED = { open: false } as const;

export const useEditorState = <T>(): Editor<T> => {
  const [state, setState] = useState<EditorState<T>>(CLOSED);

  const openCreate = useCallback(() => setState({ open: true, target: null }), []);
  const openEdit = useCallback((target: T) => setState({ open: true, target }), []);
  const close = useCallback(() => setState(CLOSED), []);

  return { state, openCreate, openEdit, close };
};
