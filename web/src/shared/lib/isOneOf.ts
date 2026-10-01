export const isOneOf = <T extends string>(allowed: readonly T[], value: string): value is T =>
  (allowed as readonly string[]).includes(value);
