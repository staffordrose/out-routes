import { NextRouter } from 'next/router';

export const shallowPush = (router: NextRouter, path: string): void => {
  router.push(path, undefined, {
    shallow: true,
  });
};
