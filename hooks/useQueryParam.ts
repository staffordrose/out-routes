import { useMemo } from 'react';
import { NextRouter } from 'next/router';

import { getQueryParam } from '@/utils';

export const useQueryParam = (
  query: NextRouter['query'],
  param: string
): string => {
  const queryParam = useMemo(() => getQueryParam(query, param), [query, param]);

  return queryParam;
};
