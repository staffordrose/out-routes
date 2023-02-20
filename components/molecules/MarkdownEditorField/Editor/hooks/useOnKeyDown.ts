import { KeyboardEvent, MutableRefObject, useCallback, useEffect } from 'react';

import { getFullLine } from '../helpers';

type UseOnKeyDownProps = {
  textarea: MutableRefObject<HTMLTextAreaElement | null>;
  selectionStart: MutableRefObject<number>;
  selectionEnd: MutableRefObject<number>;
  value: string;
  setSelection: (selection: string) => void;
  setSelectionFullLine: (selectionFullLine: string) => void;
};

export const useOnKeyDown = ({
  textarea,
  selectionStart,
  selectionEnd,
  value,
  setSelection,
  setSelectionFullLine,
}: UseOnKeyDownProps) => {
  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.target instanceof HTMLTextAreaElement) {
        if (
          [
            'Enter',
            'Backspace',
            'ArrowUp',
            'ArrowRight',
            'ArrowDown',
            'ArrowLeft',
          ].includes(e.key)
        ) {
          // get latest selectionStart, selectionEnd
          selectionStart.current = e.target.selectionStart ?? 0;
          selectionEnd.current = e.target.selectionEnd ?? 0;

          setSelection(
            value.substring(
              selectionStart.current ?? 0,
              selectionEnd.current ?? 0
            )
          );
          setSelectionFullLine(
            getFullLine(value, selectionStart.current ?? 0).content
          );
        }
      }
    },
    [selectionStart, selectionEnd, value, setSelection, setSelectionFullLine]
  );

  useEffect(() => {
    if (textarea.current) {
      const el = textarea.current;

      el.addEventListener('keyup', onKeyDown as any, false);

      return () => {
        el.removeEventListener('keyup', onKeyDown as any, false);
      };
    }
  }, [textarea, onKeyDown]);
};
