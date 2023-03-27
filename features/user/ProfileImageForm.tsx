import { FC, useCallback, useMemo } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { BiTrash } from 'react-icons/bi';

import {
  AspectRatio,
  Box,
  Button,
  IconButton,
  Image,
} from '@/components/atoms';
import { DropzoneField } from '@/components/molecules';
import { styled } from '@/styles';

export type ProfileImageFormValues = {
  files: File[];
};

export type ProfileImageFormProps = {
  isUploading: boolean;
  onSubmit: (
    values: ProfileImageFormValues,
    helpers: { reset: () => void }
  ) => void;
};

export const ProfileImageForm: FC<ProfileImageFormProps> = ({
  isUploading,
  onSubmit: onSubmitHandler,
}) => {
  const { control, formState, onSubmit, reset } = useProfileImageForm({
    onSubmit: onSubmitHandler,
  });

  const watchFiles = useWatch({
    control,
    name: 'files',
  });

  const imageSrc = useMemo(
    () =>
      Array.isArray(watchFiles) && watchFiles.length > 0
        ? URL.createObjectURL(watchFiles[0])
        : undefined,
    [watchFiles]
  );

  return (
    <form onSubmit={onSubmit} encType='multipart/form-data'>
      {!!imageSrc ? (
        <ImagePreview>
          <AspectRatio ratio={1}>
            <Image fill src={imageSrc} alt='Image preview' objectFit='cover' />
          </AspectRatio>
          <IconButton
            type='button'
            variant='outline'
            size='lg'
            borderRadius='full'
            disabled={formState.isSubmitting || isUploading}
            onClick={() => {
              reset();
            }}
          >
            <BiTrash />
          </IconButton>
        </ImagePreview>
      ) : (
        <Box display='block' width='full'>
          <Controller
            name='files'
            control={control}
            render={({ field, fieldState: { isTouched, error } }) => (
              <DropzoneField
                {...field}
                borderRadius='full'
                accept={{ 'image/jpeg': [], 'image/png': [] }}
                disabled={formState.isSubmitting || isUploading}
                isTouched={isTouched}
                error={error?.message}
              />
            )}
          />
        </Box>
      )}

      <SubmitButtonContainer>
        <Button
          type='submit'
          variant='solid'
          size='lg'
          display='flex'
          disabled={!imageSrc || formState.isSubmitting || isUploading}
        >
          Upload Image
        </Button>
      </SubmitButtonContainer>
    </form>
  );
};

const useProfileImageForm = ({
  onSubmit: onSubmitHandler,
}: Pick<ProfileImageFormProps, 'onSubmit'>) => {
  const validationSchema = useMemo(
    () =>
      yup.object({
        files: yup.array().of(yup.mixed().required()),
      }),
    []
  );

  const { control, formState, handleSubmit, reset } =
    useForm<ProfileImageFormValues>({
      mode: 'onBlur',
      defaultValues: { files: [] },
      resolver: yupResolver(validationSchema),
    });

  const onSubmit = useCallback(
    (values: ProfileImageFormValues) => {
      onSubmitHandler(values, { reset });
    },
    [reset, onSubmitHandler]
  );

  return {
    control,
    formState,
    onSubmit: handleSubmit(onSubmit),
    reset,
  };
};

const ImagePreview = styled('div', {
  display: 'block',
  position: 'relative',
  overflow: 'hidden',
  width: '$full',
  borderRadius: '$full',
  backgroundColor: '$slate-50',
  '& > button': {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    opacity: 0,
  },
  '&:hover > button:not(:disabled)': {
    opacity: 1,
  },
  '&:focus-within > button:not(:disabled)': {
    opacity: 1,
  },
});

const SubmitButtonContainer = styled('div', {
  display: 'flex',
  justifyContent: 'flex-end',
  width: '$full',
  marginTop: '$4',
});
