import { z } from 'zod';

const requiredText = z.string().trim().min(1);

const envSchema = z.object({
  VITE_FIREBASE_API_KEY: requiredText,
  VITE_FIREBASE_AUTH_DOMAIN: requiredText,
  VITE_FIREBASE_PROJECT_ID: requiredText,
  VITE_FIREBASE_STORAGE_BUCKET: requiredText,
  VITE_FIREBASE_MESSAGING_SENDER_ID: requiredText,
  VITE_FIREBASE_APP_ID: requiredText,
  VITE_USE_EMULATORS: z.enum(['true', 'false']).default('false'),
  VITE_DEFAULT_LANG: z.string().optional(),
});

const parsed = envSchema.safeParse(import.meta.env);

if (!parsed.success) {
  const missing = parsed.error.issues.map((issue) => issue.path.join('.')).join(', ');
  throw new Error(`Invalid environment configuration: ${missing}. See web/.env.example.`);
}

const env = parsed.data;

export const FIREBASE_OPTIONS = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
} as const;

export const USE_EMULATORS = env.VITE_USE_EMULATORS === 'true';
export const DEFAULT_LANG_SETTING = env.VITE_DEFAULT_LANG;
