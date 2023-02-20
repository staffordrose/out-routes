import { MutableRefObject, useCallback } from 'react';

import { triggerTextareaChange } from '@/utils';
import { getFullLine } from '../helpers';
import {
  HeadingType,
  HeadingTypes,
  HeadingTypesMarkdown,
  Selection,
} from '../types';

type UseChangeHeadingTypeProps = {
  textarea: MutableRefObject<HTMLTextAreaElement | null>;
  selectionStart: MutableRefObject<number>;
  selectionEnd: MutableRefObject<number>;
  setValue: (value: string) => void;
  setSelection: (selection: Selection) => void;
};

export const useChangeHeadingType = ({
  textarea,
  selectionStart,
  selectionEnd,
  setValue,
  setSelection,
}: UseChangeHeadingTypeProps) => {
  const changeHeadingType = useCallback(
    (type: HeadingType) => {
      // get latest selectionStart, selectionEnd
      selectionStart.current = textarea.current?.selectionStart ?? 0;
      selectionEnd.current = textarea.current?.selectionEnd ?? 0;

      const value = textarea.current?.value || '';

      const { startIndex, content } = getFullLine(
        value,
        selectionStart.current
      );

      // set selectionStart to startIndex of selected line
      selectionStart.current = startIndex ?? 0;

      const contentEnd = selectionStart.current + content.length;

      let s = content;

      const addPrefix = (count: number, prefix: string) => {
        s = prefix + s;
        selectionEnd.current = contentEnd + count;
      };

      const removePrefix = (count: number | undefined = 1) => {
        s = s.substring(count);
        selectionEnd.current = contentEnd - count;
      };

      if (type === HeadingTypes.H1) {
        switch (true) {
          case s.startsWith(HeadingTypesMarkdown.H1):
            removePrefix(2);
            break;
          case s.startsWith(HeadingTypesMarkdown.H2):
            removePrefix();
            break;
          case s.startsWith(HeadingTypesMarkdown.H3):
            removePrefix(2);
            break;
          default:
            addPrefix(2, HeadingTypesMarkdown.H1);
            break;
        }
      } else if (type === HeadingTypes.H2) {
        switch (true) {
          case s.startsWith(HeadingTypesMarkdown.H2):
            removePrefix(3);
            break;
          case s.startsWith(HeadingTypesMarkdown.H1):
            addPrefix(1, '#'); // h1 to h2
            break;
          case s.startsWith(HeadingTypesMarkdown.H3):
            removePrefix();
            break;
          default:
            addPrefix(3, HeadingTypesMarkdown.H2);
            break;
        }
      } else if (type === HeadingTypes.H3) {
        switch (true) {
          case s.startsWith(HeadingTypesMarkdown.H3):
            removePrefix(4);
            break;
          case s.startsWith(HeadingTypesMarkdown.H1):
            addPrefix(2, '##'); // h1 to h3
            break;
          case s.startsWith(HeadingTypesMarkdown.H2):
            addPrefix(1, '#'); // h2 to h3
            break;
          default:
            addPrefix(4, HeadingTypesMarkdown.H3);
            break;
        }
      }

      textarea.current?.focus();
      textarea.current?.setRangeText(
        s,
        selectionStart.current,
        contentEnd,
        'end'
      );

      // get latest selectionStart, selectionEnd
      selectionStart.current = textarea.current?.selectionStart ?? 0;
      selectionEnd.current = textarea.current?.selectionEnd ?? 0;

      const nextValue = textarea.current?.value || '';

      // manually trigger onChange method
      if (textarea.current) {
        triggerTextareaChange(textarea.current, nextValue);
      }

      setValue(nextValue);
      setSelection({
        content: '',
        fullLine: getFullLine(nextValue, selectionStart.current).content,
      });
    },
    [textarea, selectionStart, selectionEnd, setValue, setSelection]
  );

  return changeHeadingType;
};
