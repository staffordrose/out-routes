import { useMemo } from 'react';

import { startsAndEndsWith, trimHeadingsAndWhitespace } from '../helpers';
import { StyleType, StyleTypes, StyleTypesMarkdown } from '../types';

export const useStyleTypes = (selection: string) => {
  const styleTypes = useMemo<StyleType[]>(() => {
    const trimmed = trimHeadingsAndWhitespace(selection);

    let types: StyleType[] = [];

    if (
      selection?.length >= 4 &&
      startsAndEndsWith(trimmed, StyleTypesMarkdown.B)
    ) {
      types.push(StyleTypes.B);
    }

    if (
      selection?.length >= 2 &&
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
  }, [selection]);

  return styleTypes;
};
