import { reservedSlugs } from '@/data/routes';
import { StatusError } from '../misc';

export const validateSlug = (slug: string): void => {
  if (reservedSlugs.includes(slug)) {
    throw new StatusError(
      400,
      `The slug you have chosen is reserved and cannot be used`
    );
  }
};
