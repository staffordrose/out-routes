import { FC, useMemo } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { BiTrash } from 'react-icons/bi';

import {
  AspectRatio,
  Box,
  IconButton,
  Image,
  ToastContents,
} from '@/components/atoms';
import { DropzoneField } from '@/components/molecules';
import { useUploadRouteImageMutation } from '@/lib/v1/hooks/uploads';
import { styled } from '@/styles';
import { Route } from '@/types';
import { RouteFormValues } from '../helpers';

type ImageFieldProps = {
  routeId: Route['id'];
  openToast?: (contents: ToastContents) => void;
};

export const ImageField: FC<ImageFieldProps> = ({ routeId, openToast }) => {
  const { control, formState, setValue } = useFormContext<RouteFormValues>();

  const watchFiles = useWatch({
    control,
    name: 'route.files',
  });

  const existingImage = useWatch({
    control,
    name: 'route.image_banner',
  });

  const imageSrc = useMemo(
    () =>
      Array.isArray(watchFiles) && watchFiles.length > 0
        ? URL.createObjectURL(watchFiles[0])
        : undefined,
    [watchFiles]
  );

  const uploadRouteImageMutation = useUploadRouteImageMutation({
    openToast,
    onSuccess: ({
      image_id,
      image_full,
      image_og,
      image_banner,
      image_card_banner,
      image_thumb_360,
      image_thumb_240,
      image_thumb_120,
    }) => {
      setValue('route.files', []);
      setValue('route.image_id', image_id || null);
      setValue('route.image_full', image_full || null);
      setValue('route.image_og', image_og || null);
      setValue('route.image_banner', image_banner || null);
      setValue('route.image_card_banner', image_card_banner || null);
      setValue('route.image_thumb_360', image_thumb_360 || null);
      setValue('route.image_thumb_240', image_thumb_240 || null);
      setValue('route.image_thumb_120', image_thumb_120 || null);
    },
  });

  return (
    <StyledImageField>
      {existingImage || !!imageSrc ? (
        <Preview>
          <AspectRatio ratio={16 / 9}>
            <Image
              priority
              fill
              src={existingImage || imageSrc || ''}
              alt='Image preview'
              objectFit='contain'
            />
          </AspectRatio>
          <IconButton
            type='button'
            variant='outline'
            size='lg'
            disabled={formState.isSubmitting}
            onClick={() => {
              setValue('route.files', []);
              setValue('route.image_id', '');
              setValue('route.image_full', '');
              setValue('route.image_og', '');
              setValue('route.image_banner', '');
              setValue('route.image_card_banner', '');
              setValue('route.image_thumb_360', '');
              setValue('route.image_thumb_240', '');
              setValue('route.image_thumb_120', '');
            }}
          >
            <BiTrash />
          </IconButton>
        </Preview>
      ) : (
        <Box display='block' width='full'>
          <Controller
            name='route.files'
            control={control}
            render={({
              field: { onChange, ...field },
              fieldState: { isTouched, error },
            }) => (
              <DropzoneField
                {...field}
                aspectRatio={32 / 9}
                onChange={(files) => {
                  onChange(files);

                  if (Array.isArray(files)) {
                    uploadRouteImageMutation.mutate({
                      id: routeId,
                      file: files[0],
                    });
                  }
                }}
                accept={{ 'image/jpeg': [], 'image/png': [] }}
                disabled={uploadRouteImageMutation.isLoading}
                isTouched={isTouched}
                error={error?.message}
              />
            )}
          />
        </Box>
      )}
    </StyledImageField>
  );
};

const StyledImageField = styled('div', {
  marginBottom: '$2_5',
  '@sm': {
    marginBottom: '$3',
  },
  '@md': {
    marginBottom: '$3_5',
  },
  '@lg': {
    marginBottom: '$4',
  },
});

const Preview = styled('div', {
  display: 'block',
  position: 'relative',
  overflow: 'hidden',
  width: '$full',
  borderRadius: '$md',
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
