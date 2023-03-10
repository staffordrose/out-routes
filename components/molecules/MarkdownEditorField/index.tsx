import {
  ComponentPropsWithoutRef,
  ForwardedRef,
  forwardRef,
  ReactNode,
  useState,
} from 'react';
import ReactIs from 'react-is';

import { Label, Text, Textarea } from '@/components/atoms';
import { useUndoableState } from '@/hooks';
import { styled } from '@/styles';
import { Editor } from './Editor';
import { Preview } from './Preview';

export type MarkdownEditorFieldProps = ComponentPropsWithoutRef<
  typeof Textarea
> & {
  label?: ReactNode;
  isTouched?: boolean;
  error?: string;
};

export const MarkdownEditorField = forwardRef(
  (
    { label, isTouched, error, ...props }: MarkdownEditorFieldProps,
    ref: ForwardedRef<HTMLTextAreaElement>
  ) => {
    const {
      states,
      index,
      state: value,
      setState: setValue,
      goBack,
      goForward,
    } = useUndoableState(
      props.value
        ? props.value.toString()
        : props.defaultValue
        ? props.defaultValue.toString()
        : ''
    );

    const [selection, setSelection] = useState({
      content: '',
      fullLine: '',
    });

    return (
      <StyledMarkdownEditorField>
        {ReactIs.isValidElementType(label) && (
          <Label htmlFor={props.id || props.name}>{label}</Label>
        )}
        <div>
          <Editor
            ref={ref}
            {...props}
            valueHistoryLength={states.length}
            valueHistoryIndex={index}
            value={value}
            setValue={setValue}
            goBack={goBack}
            goForward={goForward}
            selection={selection}
            setSelection={setSelection}
          />
          <Preview value={value} />
        </div>
        {isTouched && !!error && <Text color='red-700'>{error}</Text>}
      </StyledMarkdownEditorField>
    );
  }
);

MarkdownEditorField.displayName = 'MarkdownEditorField';

const StyledMarkdownEditorField = styled('div', {
  width: '$full',
  '& > div': {
    display: 'grid',
    gap: '$4',
    alignItems: 'start',
  },
  '@sm': {
    '& > div': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
  },
});
