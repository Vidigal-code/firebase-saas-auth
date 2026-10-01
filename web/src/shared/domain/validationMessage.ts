import type { TranslationKey } from '@/shared/i18n/translate';

// Schemas carry translation keys as messages; forms translate them on render.
export const withMessage = (key: TranslationKey): { message: TranslationKey } => ({ message: key });
