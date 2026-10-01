import { defineConfig } from 'vitest/config';
import { BASE_COVERAGE, DEMO_FIREBASE_ENV, SOURCE_ALIAS } from './vite.config.ts';

const EMULATOR_TEST_TIMEOUT_MS = 20_000;

// Runs the real repositories and auth service against the Auth and Firestore emulators
// (see scripts/with-emulators.mjs), so writes are checked by firestore.rules.
export default defineConfig({
  resolve: {
    alias: SOURCE_ALIAS,
  },
  test: {
    environment: 'node',
    include: ['src/**/*.integration.test.ts'],
    fileParallelism: false,
    testTimeout: EMULATOR_TEST_TIMEOUT_MS,
    coverage: {
      ...BASE_COVERAGE,
      reportsDirectory: 'coverage-integration',
    },
    env: {
      ...DEMO_FIREBASE_ENV,
      VITE_FIREBASE_API_KEY: 'demo-api-key',
      VITE_FIREBASE_APP_ID: 'demo-app-id',
      VITE_USE_EMULATORS: 'true',
    },
  },
});
