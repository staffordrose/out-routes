import { FC } from 'react';

import { countries, CountryCodes } from '@/data/general';

type CountryProps = {
  country?: string | null;
};

export const Country: FC<CountryProps> = ({ country }) => {
  if (!country) return null;
  return <span>{countries[country as CountryCodes]}</span>;
};
