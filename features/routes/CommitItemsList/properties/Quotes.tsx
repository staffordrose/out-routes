import { FC } from 'react';

type QuotesProps = {
  text?: string | null;
};

export const Quotes: FC<QuotesProps> = ({ text }) => {
  if (!text) return null;
  return <span>{JSON.stringify(text)}</span>;
};
