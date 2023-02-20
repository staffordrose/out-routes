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

export type EditorProps = ComponentPropsWithoutRef<typeof Textarea> & {
  value: string;
  setValue: (value: string) => void;
  selection: string;
  setSelection: (selection: string) => void;
  selectionFullLine: string;
  setSelectionFullLine: (selectionFullLine: string) => void;
};

export const Editor = forwardRef(
  (
    {
      value,
      setValue,
      selection,
      setSelection,
      selectionFullLine,
      setSelectionFullLine,
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
      setSelectionFullLine,
    });

    const onClick = (e: SyntheticEvent<HTMLTextAreaElement>) => {
      if (e.target instanceof HTMLTextAreaElement) {
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
    };

    const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      typeof props.onChange === 'function' && props.onChange(e);

      // get latest selectionStart, selectionEnd
      selectionStart.current = e.target.selectionStart ?? 0;
      selectionEnd.current = e.target.selectionEnd ?? 0;

      const { value } = e.target;

      setValue(value);
      setSelection(
        (value || '').substring(
          selectionStart.current ?? 0,
          selectionEnd.current ?? 0
        )
      );
      setSelectionFullLine(
        getFullLine(value, selectionStart.current ?? 0).content
      );
    };

    return (
      <StyledEditor>
        <EditorActions
          textarea={textarea}
          selectionStart={selectionStart}
          selectionEnd={selectionEnd}
          setValue={setValue}
          selection={selection}
          setSelection={setSelection}
          selectionFullLine={selectionFullLine}
          setSelectionFullLine={setSelectionFullLine}
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
  borderWidth: '$2',
  borderStyle: 'solid',
  borderColor: '$slate-300',
  borderRadius: '$md',
  backgroundColor: '$white',
  '&:has(> textarea:enabled):hover': {
    borderColor: '$slate-700',
  },
  '&:has(> textarea:enabled):focus-within': {
    borderColor: '$slate-700',
    outlineWidth: '$2',
    outlineStyle: 'dashed',
    outlineColor: '$slate-500',
  },
  '&:has(> textarea:disabled)': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
});

const StyledTextarea = styled('textarea', {
  all: 'unset',
  boxSizing: 'border-box',
  resize: 'vertical',
  width: '$full',
  minHeight: '360px',
  padding: '$2',
  lineHeight: '$xs',
  color: '$slate-900',
  backgroundColor: 'transparent',
});
