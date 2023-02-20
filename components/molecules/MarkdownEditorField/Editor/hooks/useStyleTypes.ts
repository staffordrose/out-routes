import { useMemo } from 'react';

import { startsAndEndsWith, trimHeadingsAndWhitespace } from '../helpers';
import { Selection, StyleType, StyleTypes, StyleTypesMarkdown } from '../types';

export const useStyleTypes = (selectionContent: Selection['content']) => {
  const styleTypes = useMemo<StyleType[]>(() => {
    const trimmed = trimHeadingsAndWhitespace(selectionContent);

    let types: StyleType[] = [];

    if (
      selectionContent?.length >= 4 &&
      startsAndEndsWith(trimmed, StyleTypesMarkdown.B)
    ) {
      types.push(StyleTypes.B);
    }

    if (
      selectionContent?.length >= 2 &&
      !!(
        startsAndEndsWith(trimmed, StyleTypesMarkdown.BI) ||
        (startsAndEndsWith(trimmed, StyleTypesMarkdown.I) &&
          trimmed[1] !== '*' &&
          trimmed[trimmed.length - 2] !== '*')
      )
    ) {
      types.push(StyleTypes.I);
    }

    return types;
  }, [selectionContent]);

  return styleTypes;
};
