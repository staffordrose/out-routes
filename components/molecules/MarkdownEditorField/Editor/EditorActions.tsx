import { FC, MutableRefObject } from 'react';

import { Text, ToggleGroup } from '@/components/atoms';
import { styled } from '@/styles';
import {
  useChangeHeadingType,
  useChangeStyleType,
  useHeadingType,
  useStyleTypes,
} from './hooks';
import {
  HeadingType,
  HeadingTypes,
  Selection,
  StyleType,
  StyleTypes,
} from './types';

export type EditorActionsProps = {
  textarea: MutableRefObject<HTMLTextAreaElement | null>;
  selectionStart: MutableRefObject<number>;
  selectionEnd: MutableRefObject<number>;
  setValue: (value: string) => void;
  selection: Selection;
  setSelection: (selection: Selection) => void;
};

export const EditorActions: FC<EditorActionsProps> = ({
  textarea,
  selectionStart,
  selectionEnd,
  setValue,
  selection,
  setSelection,
}) => {
  const changeHeadingType = useChangeHeadingType({
    textarea,
    selectionStart,
    selectionEnd,
    setValue,
    setSelection,
  });

  const changeStyleType = useChangeStyleType({
    textarea,
    selectionStart,
    selectionEnd,
    setValue,
    setSelection,
  });

  const headingType = useHeadingType(selection.fullLine);

  const styleTypes = useStyleTypes(selection.content);

  return (
    <StyledEditorActions>
      <ToggleGroup
        type='single'
        aria-label='Headings'
        value={headingType}
        onValueChange={(type: HeadingType) => {
          changeHeadingType(type || headingType);
        }}
      >
        <ToggleGroup.Item
          variant='ghost'
          value={HeadingTypes.H1}
          aria-label='Heading 1'
        >
          <Text as='span' fontFamily='heading' fontWeight='bold'>
            H1
          </Text>
        </ToggleGroup.Item>
        <ToggleGroup.Item
          variant='ghost'
          value={HeadingTypes.H2}
          aria-label='Heading 2'
        >
          <Text as='span' fontFamily='heading' fontWeight='bold'>
            H2
          </Text>
        </ToggleGroup.Item>
        <ToggleGroup.Item
          variant='ghost'
          value={HeadingTypes.H3}
          aria-label='Heading 3'
        >
          <Text as='span' fontFamily='heading' fontWeight='bold'>
            H3
          </Text>
        </ToggleGroup.Item>
      </ToggleGroup>
      <ToggleGroup
        type='multiple'
        aria-label='Styles'
        value={styleTypes}
        onValueChange={(types: StyleType[]) => {
          if (!Array.isArray(styleTypes) || !styleTypes.length) {
            changeStyleType(types[0]);
          } else {
            const type =
              types.find((t) => !styleTypes.includes(t)) ||
              styleTypes.find((t) => !types.includes(t));

            type && changeStyleType(type);
          }
        }}
      >
        <ToggleGroup.Item
          variant='ghost'
          value={StyleTypes.B}
          aria-label='Bold'
        >
          <Text as='span' fontFamily='heading' fontWeight='bold'>
            B
          </Text>
        </ToggleGroup.Item>
        <ToggleGroup.Item
          variant='ghost'
          value={StyleTypes.I}
          aria-label='Italic'
        >
          <Text as='span' fontFamily='heading' fontWeight='bold'>
            I
          </Text>
        </ToggleGroup.Item>
      </ToggleGroup>
    </StyledEditorActions>
  );
};

const StyledEditorActions = styled('div', {
  display: 'flex',
  gap: '$2',
  alignItems: 'center',
  minHeight: '$12',
  paddingX: '$2',
  backgroundColor: '$slate-100',
});
