import { useCallback } from 'react';
import type { FieldError } from 'react-hook-form';
import type { TranslationKey, TranslationParams } from './translate';
import { useTranslation } from './useTranslation';

export type FieldErrorTranslator = (error: FieldError | undefined, params?: TranslationParams) => string | undefined;

// Validation schemas use translation keys as messages (see shared/domain/validationMessage.ts).
export const useFieldError = (): FieldErrorTranslator => {
  const { t } = useTranslation();

  return useCallback<FieldErrorTranslator>(
    (error, params) => (error?.message ? t(error.message as TranslationKey, params) : undefined),
    [t],
  );
};
