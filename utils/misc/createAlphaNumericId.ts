import { customAlphabet } from 'nanoid';

export const createAlphaNumericId = (length?: number) => {
  const nanoid = customAlphabet(
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    length ? Number(length) : 16
  );
  return nanoid();
};
