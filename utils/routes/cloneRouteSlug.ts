import { customAlphabet } from 'nanoid';

export const cloneRouteSlug = (slug: string, isExisting: boolean) => {
  if (isExisting) {
    const nanoid = customAlphabet(
      '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
      8
    );
    return slug.concat(`-${nanoid()}`);
  }
  return slug;
};
