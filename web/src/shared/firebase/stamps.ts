import { serverTimestamp, type FieldValue } from 'firebase/firestore';

interface UpdateStamp {
  updatedAt: FieldValue;
}

interface CreationStamps extends UpdateStamp {
  createdAt: FieldValue;
}

export const creationStamps = (): CreationStamps => ({ createdAt: serverTimestamp(), updatedAt: serverTimestamp() });

export const updateStamp = (): UpdateStamp => ({ updatedAt: serverTimestamp() });
