// Must match the limits enforced in firestore.rules.
export const NAME_MAX_LENGTH = 80;
export const MESSAGE_MAX_LENGTH = 1000;
export const MAX_RECIPIENTS = 200;
export const PHONE_PATTERN = /^\+?[1-9]\d{9,14}$/;
