import {
  ComponentPropsWithoutRef,
  ForwardedRef,
  forwardRef,
  useCallback,
  useState,
} from 'react';
import { Accept, FileRejection, useDropzone } from 'react-dropzone';
import * as RadixAspectRatio from '@radix-ui/react-aspect-ratio';
import type * as Stitches from '@stitches/react';

import { styled } from '@/styles';

export type DropzoneProps = ComponentPropsWithoutRef<typeof StyledDropzone> & {
  css?: Stitches.CSS;
  aspectRatio?: number;
  borderRadius?: 'default' | 'full';
  accept?: Accept;
  multiple?: boolean;
  disabled?: boolean;
  onFileDrop: (files: File[]) => void;
};

export const Dropzone = forwardRef(
  (
    {
      aspectRatio = 1,
      accept,
      multiple = false,
      disabled = false,
      onFileDrop,
      ...dropzoneProps
    }: DropzoneProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const [error, setError] = useState('');

    const onDrop = useCallback(
      (acceptedFiles: File[], fileRejections: FileRejection[]) => {
        setError('');

        if (Array.isArray(fileRejections) && fileRejections.length) {
          fileRejections.forEach((file) => {
            file.errors.forEach((err) => {
              if (err.code === 'file-too-large') {
                setError(`Error: ${err.message}`);
              }

              if (err.code === 'file-invalid-type') {
                setError(`Error: ${err.message}`);
              }
            });
          });
        } else {
          onFileDrop(acceptedFiles);
        }
      },
      [onFileDrop]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      accept,
      multiple,
      disabled,
      onDrop,
    });

    return (
      <StyledDropzone {...dropzoneProps} {...getRootProps()} ref={ref}>
        <StyledInput {...getInputProps()} disabled={disabled} />
        <AspectRatio ratio={aspectRatio}>
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>
              Drag &apos;n&apos; drop {multiple ? `some files` : `a file`} here,
              or click to select
            </p>
          )}
          {!!error && <ErrorMessage>{error}</ErrorMessage>}
        </AspectRatio>
      </StyledDropzone>
    );
  }
);

Dropzone.displayName = 'Dropzone';

const StyledDropzone = styled('div', {
  padding: '$4',
  borderWidth: '$2',
  borderStyle: 'solid',
  borderColor: '$slate-300',
  fontSize: '$md',
  textAlign: 'center',
  color: '$slate-900',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  '&:hover': {
    borderColor: '$slate-700',
    backgroundColor: '$slate-50',
  },
  '&:focus-within': {
    borderColor: '$slate-700',
    backgroundColor: '$slate-50',
    outlineWidth: '$2',
    outlineStyle: 'dashed',
    outlineColor: '$slate-500',
  },
  '&:has(> input:disabled)': {
    borderColor: '$gray-300',
    color: '$gray-900',
    backgroundColor: 'transparent',
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  variants: {
    borderRadius: {
      default: { borderRadius: '$md' },
      full: { borderRadius: '$full' },
    },
  },
  defaultVariants: {
    borderRadius: 'default',
  },
});

const StyledInput = styled('input', {
  all: 'unset',
  boxSizing: 'border-box',
});

const AspectRatio = styled(RadixAspectRatio.Root, {
  display: 'flex',
  flexDirection: 'column',
  gap: '$4',
  placeItems: 'center',
  width: '$full',
});

const ErrorMessage = styled('p', {
  padding: '$1',
  fontSize: '$sm',
  color: '$red-700',
});
