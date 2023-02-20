import { useMemo } from 'react';

import {
  HeadingType,
  HeadingTypes,
  HeadingTypesMarkdown,
  Selection,
} from '../types';

export const useHeadingType = (selectionFullLine: Selection['fullLine']) => {
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
