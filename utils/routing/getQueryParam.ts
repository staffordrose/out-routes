import { NextRouter } from 'next/router';

export const getQueryParam = (
  query: NextRouter['query'],
  param: string
): string => {
  const queryParam = query ? query[param] : '';

  return Array.isArray(queryParam) ? queryParam[0] || '' : queryParam || '';
};
