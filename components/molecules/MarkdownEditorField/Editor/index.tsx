import {
  ChangeEvent,
  ComponentPropsWithoutRef,
  ForwardedRef,
  forwardRef,
  KeyboardEvent,
  SyntheticEvent,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';

import { Text, Textarea, ToggleGroup } from '@/components/atoms';
import { useTextareaAutoResize } from '@/hooks';
import { styled } from '@/styles';
import { triggerTextareaChange } from '@/utils';
import {
  getFullLine,
  startsAndEndsWith,
  trimHeadingsAndWhitespace,
} from './helpers';
import {
  HeadingType,
  HeadingTypes,
  HeadingTypesMarkdown,
  StyleType,
  StyleTypes,
  StyleTypesMarkdown,
} from './types';

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
      placeholder,
      onChange,
      onBlur,
      value,
      setValue,
      selection,
      setSelection,
      selectionFullLine,
      setSelectionFullLine,
    }: EditorProps,
    ref: ForwardedRef<HTMLTextAreaElement>
  ) => {
    const textarea = useRef<HTMLTextAreaElement>(null);

    useImperativeHandle(ref, () => textarea.current as HTMLTextAreaElement);

    useTextareaAutoResize(textarea);

    const selectionStart = useRef<number>(0);
    const selectionEnd = useRef<number>(0);

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
      [value, setSelection, setSelectionFullLine]
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

    const handleOnChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      typeof onChange === 'function' && onChange(e);

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

    const transformLine = useCallback(
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
        setSelection('');
        setSelectionFullLine(
          getFullLine(nextValue, selectionStart.current).content
        );
      },
      [setValue, setSelection, setSelectionFullLine]
    );

    const transformSelection = useCallback(
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
        setSelection(
          nextValue.substring(selectionStart.current, selectionEnd.current)
        );
        setSelectionFullLine(
          getFullLine(nextValue, selectionStart.current).content
        );
      },
      [setValue, setSelection, setSelectionFullLine]
    );

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

    return (
      <StyledEditor>
        <ButtonGroup>
          <ToggleGroup
            type='single'
            aria-label='Headings'
            value={headingType}
            onValueChange={(type: HeadingType) => {
              transformLine(type || headingType);
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
                transformSelection(types[0]);
              } else {
                const type =
                  types.find((t) => !styleTypes.includes(t)) ||
                  styleTypes.find((t) => !types.includes(t));

                type && transformSelection(type);
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
        </ButtonGroup>
        <StyledTextarea
          ref={textarea}
          placeholder={placeholder}
          defaultValue={value}
          onClick={onClick}
          onChange={handleOnChange}
          onBlur={onBlur}
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

const ButtonGroup = styled('div', {
  display: 'flex',
  gap: '$2',
  alignItems: 'center',
  minHeight: '$12',
  paddingX: '$2',
  backgroundColor: '$slate-100',
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
