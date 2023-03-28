import {
  ComponentPropsWithoutRef,
  ForwardedRef,
  forwardRef,
  ReactNode,
} from 'react';
import ReactIs from 'react-is';

import { styled } from '@/styles';
import { Dropzone, DropzoneProps, Label, Text } from '../atoms';

export type DropzoneFieldProps = Omit<
  ComponentPropsWithoutRef<typeof Dropzone>,
  'onFileDrop'
> & {
  id?: string;
  name?: string;
  isRequired?: boolean;
  label?: ReactNode;
  onChange: (files: File[]) => void;
  isTouched?: boolean;
  error?: string;
};

export const DropzoneField = forwardRef(
  (
    {
      isRequired,
      label,
      onChange,
      isTouched,
      error,
      ...dropzoneProps
    }: DropzoneFieldProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const isError = isTouched && !!error;

    return (
      <StyledDropzoneField>
        {ReactIs.isValidElementType(label) && (
          <Label htmlFor={dropzoneProps.id || dropzoneProps.name}>
            {label}
            {!isRequired ? (
              <Text
                as='span'
                fontSize='sm'
                fontStyle='italic'
                colorScheme='slate'
                colorScale={500}
              >
                {' - '}
                <span>Optional</span>
              </Text>
            ) : null}
          </Label>
        )}
        <Dropzone
          ref={ref}
          {...dropzoneProps}
          onFileDrop={onChange as DropzoneProps['onFileDrop']}
          isError={isError}
        />
        {isError && (
          <Text fontSize='sm' colorScheme='red' colorScale={700}>
            {error}
          </Text>
        )}
      </StyledDropzoneField>
    );
  }
);

DropzoneField.displayName = 'DropzoneField';

const StyledDropzoneField = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$1',
  width: '$full',
});
