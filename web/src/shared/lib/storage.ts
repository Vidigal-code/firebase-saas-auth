// localStorage can throw (private mode, blocked storage); preferences are optional.
export const readPreference = (key: string): string | null => {
  try {
    return globalThis.localStorage.getItem(key);
  } catch {
    return null;
  }
};

export const writePreference = (key: string, value: string): void => {
  try {
    globalThis.localStorage.setItem(key, value);
  } catch {
    // Preference is kept in memory only.
  }
};
