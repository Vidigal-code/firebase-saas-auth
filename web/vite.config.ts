import { fileURLToPath, URL } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const VENDOR_CHUNKS = [
  { name: 'firebase-firestore', test: /node_modules[\\/]@firebase[\\/]firestore/ },
  { name: 'firebase-auth', test: /node_modules[\\/]@firebase[\\/]auth/ },
  { name: 'firebase-core', test: /node_modules[\\/](@?firebase)[\\/]/ },
  { name: 'mui', test: /node_modules[\\/](@mui|@emotion)[\\/]/ },
  { name: 'react', test: /node_modules[\\/](react|react-dom|react-router|scheduler)[\\/]/ },
];

export const SOURCE_ALIAS = { '@': fileURLToPath(new URL('./src', import.meta.url)) };

export const DEMO_FIREBASE_ENV = {
  VITE_FIREBASE_AUTH_DOMAIN: 'demo-broadcast.firebaseapp.com',
  VITE_FIREBASE_PROJECT_ID: 'demo-broadcast',
  VITE_FIREBASE_STORAGE_BUCKET: 'demo-broadcast.appspot.com',
  VITE_FIREBASE_MESSAGING_SENDER_ID: '0',
};

export const BASE_COVERAGE = {
  provider: 'v8' as const,
  include: ['src/**/*.{ts,tsx}'],
  exclude: ['src/**/*.test.{ts,tsx}', 'src/test/**'],
  reporter: ['text-summary', 'lcov'],
};

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: SOURCE_ALIAS,
  },
  build: {
    rolldownOptions: {
      output: { codeSplitting: { groups: VENDOR_CHUNKS } },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    exclude: ['src/**/*.integration.test.ts'],
    css: false,
    testTimeout: 15_000,
    env: {
      ...DEMO_FIREBASE_ENV,
      VITE_FIREBASE_API_KEY: 'test-api-key',
      VITE_FIREBASE_APP_ID: 'test-app-id',
      VITE_DEFAULT_LANG: 'pt',
    },
    coverage: {
      ...BASE_COVERAGE,
      exclude: [...BASE_COVERAGE.exclude, 'src/main.tsx', 'src/vite-env.d.ts'],
    },
  },
});
