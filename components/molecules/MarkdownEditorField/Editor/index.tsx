import {
  ChangeEvent,
  ComponentPropsWithoutRef,
  ForwardedRef,
  forwardRef,
  SyntheticEvent,
  useImperativeHandle,
  useRef,
} from 'react';

import { Textarea } from '@/components/atoms';
import { useTextareaAutoResize } from '@/hooks';
import { styled } from '@/styles';
import { EditorActions } from './EditorActions';
import { getFullLine } from './helpers';
import { useOnKeyDown } from './hooks';
import { Selection } from './types';

export type EditorProps = ComponentPropsWithoutRef<typeof Textarea> & {
  valueHistoryLength: number;
  valueHistoryIndex: number;
  value: string;
  setValue: (value: string) => void;
  goBack: () => string;
  goForward: () => string;
  selection: Selection;
  setSelection: (selection: Selection) => void;
};

export const Editor = forwardRef(
  (
    {
      valueHistoryLength,
      valueHistoryIndex,
      value,
      setValue,
      goBack,
      goForward,
      selection,
      setSelection,
      ...props
    }: EditorProps,
    ref: ForwardedRef<HTMLTextAreaElement>
  ) => {
    const textarea = useRef<HTMLTextAreaElement>(null);

    useImperativeHandle(ref, () => textarea.current as HTMLTextAreaElement);

    useTextareaAutoResize(textarea);

    const selectionStart = useRef<number>(0);
    const selectionEnd = useRef<number>(0);

    useOnKeyDown({
      textarea,
      selectionStart,
      selectionEnd,
      value,
      setSelection,
    });

    const onClick = (e: SyntheticEvent<HTMLTextAreaElement>) => {
      if (e.target instanceof HTMLTextAreaElement) {
        // get latest selectionStart, selectionEnd
        selectionStart.current = e.target.selectionStart ?? 0;
        selectionEnd.current = e.target.selectionEnd ?? 0;

        setSelection({
          content: value.substring(
            selectionStart.current,
            selectionEnd.current
          ),
          fullLine: getFullLine(value, selectionStart.current).content,
        });
      }
    };

    const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      typeof props.onChange === 'function' && props.onChange(e);

      // get latest selectionStart, selectionEnd
      selectionStart.current = e.target.selectionStart ?? 0;
      selectionEnd.current = e.target.selectionEnd ?? 0;

      const { value } = e.target;

      // only update state when onChange is triggered by user action
      if (e.isTrusted) {
        setValue(value);
        setSelection({
          content: (value || '').substring(
            selectionStart.current,
            selectionEnd.current
          ),
          fullLine: getFullLine(value, selectionStart.current).content,
        });
      }
    };

    return (
      <StyledEditor>
        <EditorActions
          textarea={textarea}
          selectionStart={selectionStart}
          selectionEnd={selectionEnd}
          valueHistoryLength={valueHistoryLength}
          valueHistoryIndex={valueHistoryIndex}
          setValue={setValue}
          goBack={goBack}
          goForward={goForward}
          selection={selection}
          setSelection={setSelection}
        />
        <StyledTextarea
          ref={textarea}
          placeholder={props.placeholder}
          defaultValue={value}
          onClick={onClick}
          onChange={onChange}
          onBlur={props.onBlur}
        />
      </StyledEditor>
    );
  }
);

Editor.displayName = 'Editor';

const StyledEditor = styled('div', {
  overflow: 'auto',
  width: '$full',
  borderWidth: '$1',
  borderStyle: 'solid',
  borderColor: '$slate-300',
  borderRadius: '$md',
  backgroundColor: '$white',
  '&:has(> textarea:enabled):hover': {
    borderColor: '$slate-700',
  },
  '&:has(> textarea:enabled):focus-within': {
    borderColor: '$slate-700',
    outlineWidth: '$1',
    outlineStyle: 'solid',
    outlineColor: '$blue-300',
  },
  '&:has(> textarea:disabled)': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
});

const StyledTextarea = styled('textarea', {
  all: 'unset',
  boxSizing: 'border-box',
  display: 'block',
  resize: 'vertical',
  width: '$full',
  minHeight: '360px',
  padding: '$2',
  lineHeight: '$xs',
  color: '$slate-900',
  backgroundColor: 'transparent',
});
