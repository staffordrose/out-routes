import { MutableRefObject, useCallback } from 'react';

import { triggerTextareaChange } from '@/utils';
import { getFullLine, startsAndEndsWith } from '../helpers';
import { Selection, StyleType, StyleTypes, StyleTypesMarkdown } from '../types';

type UseChangeStyleTypeProps = {
  textarea: MutableRefObject<HTMLTextAreaElement | null>;
  selectionStart: MutableRefObject<number>;
  selectionEnd: MutableRefObject<number>;
  setValue: (value: string) => void;
  setSelection: (selection: Selection) => void;
};

export const useChangeStyleType = ({
  textarea,
  selectionStart,
  selectionEnd,
  setValue,
  setSelection,
}: UseChangeStyleTypeProps) => {
  const changeStyleType = useCallback(
    (type: StyleType) => {
      // get latest selectionStart, selectionEnd
      selectionStart.current = textarea.current?.selectionStart ?? 0;
      selectionEnd.current = textarea.current?.selectionEnd ?? 0;

      const value = textarea.current?.value || '';

      // remove leading # symbols
      while (value.at(selectionStart.current) === '#') {
        selectionStart.current += 1;
      }

      // remove leading whitespace
      while (value.at(selectionStart.current) === ' ') {
        selectionStart.current += 1;
      }

      // remove trailing whitespace
      while (value.at(selectionEnd.current - 1) === ' ') {
        selectionEnd.current =
          selectionEnd.current > selectionStart.current
            ? selectionEnd.current - 1
            : selectionEnd.current;
      }

      if (selectionStart.current >= selectionEnd.current) {
        textarea.current?.focus();
        if (type === StyleTypes.B) {
          textarea.current?.setRangeText(
            '****',
            selectionStart.current,
            selectionStart.current
          );
          textarea.current?.setSelectionRange(
            selectionStart.current + 2,
            selectionStart.current + 2
          );
        } else if (type === StyleTypes.I) {
          textarea.current?.setRangeText(
            '**',
            selectionStart.current,
            selectionStart.current
          );
          textarea.current?.setSelectionRange(
            selectionStart.current + 1,
            selectionStart.current + 1
          );
        }

        return;
      }

      const prevSelectionEnd = selectionEnd.current;

      let s = value.substring(selectionStart.current, selectionEnd.current);

      const addPrefixSuffix = (
        count: number,
        prefix: string,
        suffix?: string
      ) => {
        s = prefix + s + (suffix || prefix);
        selectionEnd.current += count * 2;
      };

      const removePrefixSuffix = (count: number | undefined = 1) => {
        s = s.substring(count, s.length - count);
        selectionEnd.current -= count * 2;
      };

      if (type === StyleTypes.B) {
        switch (true) {
          case startsAndEndsWith(s, StyleTypesMarkdown.BI) ||
            startsAndEndsWith(s, StyleTypesMarkdown.B):
            removePrefixSuffix(2);
            break;
          case startsAndEndsWith(s, StyleTypesMarkdown.I) ||
            !startsAndEndsWith(s, StyleTypesMarkdown.I):
            addPrefixSuffix(2, StyleTypesMarkdown.B);
            break;
          default:
            break;
        }
      } else if (type === StyleTypes.I) {
        switch (true) {
          case startsAndEndsWith(s, StyleTypesMarkdown.BI):
            removePrefixSuffix();
            break;
          case startsAndEndsWith(s, StyleTypesMarkdown.B):
            addPrefixSuffix(1, StyleTypesMarkdown.I);
            break;
          case startsAndEndsWith(s, StyleTypesMarkdown.I):
            removePrefixSuffix();
            break;
          case !startsAndEndsWith(s, StyleTypesMarkdown.B):
            addPrefixSuffix(1, StyleTypesMarkdown.I);
            break;
          default:
            break;
        }
      }

      textarea.current?.focus();
      textarea.current?.setRangeText(
        s,
        selectionStart.current,
        prevSelectionEnd,
        'select'
      );

      const nextValue = textarea.current?.value || '';

      // manually trigger onChange method
      if (textarea.current) {
        triggerTextareaChange(textarea.current, nextValue);
      }

      setValue(nextValue);
      setSelection({
        content: nextValue.substring(
          selectionStart.current,
          selectionEnd.current
        ),
        fullLine: getFullLine(nextValue, selectionStart.current).content,
      });
    },
    [textarea, selectionStart, selectionEnd, setValue, setSelection]
  );

  return changeStyleType;
};
