import { useMemo } from 'react';

import { HeadingType, HeadingTypes, HeadingTypesMarkdown } from '../types';

export const useHeadingType = (selectionFullLine: string) => {
  const headingType = useMemo<HeadingType | ''>(
    () =>
      selectionFullLine.startsWith(HeadingTypesMarkdown.H3)
        ? HeadingTypes.H3
        : selectionFullLine.startsWith(HeadingTypesMarkdown.H2)
        ? HeadingTypes.H2
        : selectionFullLine.startsWith(HeadingTypesMarkdown.H1)
        ? HeadingTypes.H1
        : '',
    [selectionFullLine]
  );

  return headingType;
};
