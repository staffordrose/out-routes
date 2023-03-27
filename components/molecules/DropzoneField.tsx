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
  label?: ReactNode;
  onChange: (files: File[]) => void;
  isTouched?: boolean;
  error?: string;
};

export const DropzoneField = forwardRef(
  (
    { label, onChange, isTouched, error, ...dropzoneProps }: DropzoneFieldProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const isError = isTouched && !!error;

    return (
      <StyledDropzoneField>
        {ReactIs.isValidElementType(label) && (
          <Label htmlFor={dropzoneProps.id || dropzoneProps.name}>
            {label}
          </Label>
        )}
        <Dropzone
          ref={ref}
          {...dropzoneProps}
          onFileDrop={onChange as DropzoneProps['onFileDrop']}
          isError={isError}
        />
        {isError && (
          <Text fontSize='sm' color='red-700'>
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
