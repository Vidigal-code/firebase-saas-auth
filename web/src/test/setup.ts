import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Component tests never talk to Firebase: repositories and hooks are mocked per test.
vi.mock('@/shared/firebase/client', () => ({ auth: {}, db: {}, firebaseApp: {} }));

const noop = (): undefined => undefined;

// jsdom has no matchMedia; MUI color schemes and media queries rely on it.
Object.defineProperty(globalThis, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: noop,
    removeEventListener: noop,
    addListener: noop,
    removeListener: noop,
    dispatchEvent: () => false,
  }),
});

afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.clearAllMocks();
});
