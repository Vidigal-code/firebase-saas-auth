import { useContext } from 'react';
import { LangContext } from '@/shared/providers/LangProvider';

export const useLang = () => useContext(LangContext);
