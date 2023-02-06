import NextHead from 'next/head';

import { sitename } from '@/data/site';

type Props = { title: string } & (
  | { description: string; isNoIndex?: never }
  | { description?: never; isNoIndex: boolean }
);

export const SEO = ({ title, description, isNoIndex }: Props) => {
  return (
    <NextHead>
      <title>{`${title} | ${sitename}`}</title>
      {isNoIndex ? (
        <meta name='robots' content='noindex' />
      ) : (
        <meta name='description' content={description} />
      )}
      <link rel='icon' href='/favicon.ico' />
    </NextHead>
  );
};
