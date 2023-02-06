import { FC } from 'react';

type TitleAltProps = {
  title_alt?: string[] | null;
};

export const TitleAlt: FC<TitleAltProps> = ({ title_alt }) => {
  if (!Array.isArray(title_alt)) return null;
  return (
    <span>{title_alt.map((text) => JSON.stringify(text)).join(', ')}</span>
  );
};
