import { FC, useState } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { BiTrash } from 'react-icons/bi';

import { AspectRatio, Box, IconButton, Image } from '@/components/atoms';
import { DropzoneField } from '@/components/molecules';
import { styled } from '@/styles';
import { RouteFormValues } from '../helpers';

export const ImageField: FC = () => {
  const { control, formState, setValue } = useFormContext<RouteFormValues>();

  const existingImage = useWatch({
    control,
    name: 'route.image_banner',
  });

  const [imageSrc, setImageSrc] = useState<string | undefined>();

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
              if (imageSrc) {
                URL.revokeObjectURL(imageSrc);
                setImageSrc(undefined);
              }

              setValue('route.files', []);
              setValue('route.image_id', null);
              setValue('route.image_full', null);
              setValue('route.image_og', null);
              setValue('route.image_banner', null);
              setValue('route.image_card_banner', null);
              setValue('route.image_thumb_360', null);
              setValue('route.image_thumb_240', null);
              setValue('route.image_thumb_120', null);
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
                  if (Array.isArray(files) && files.length) {
                    onChange(files);

                    const imageSrc = URL.createObjectURL(files[0]);
                    setImageSrc(imageSrc);

                    let imageId = imageSrc.split(
                      process.env.NEXT_PUBLIC_URL || ''
                    )[1];

                    if (imageId.startsWith('/')) {
                      imageId = imageId.slice(1);
                    }

                    setValue('route.image_id', imageId);
                    setValue('route.image_full', imageSrc);
                    setValue('route.image_og', imageSrc);
                    setValue('route.image_banner', imageSrc);
                    setValue('route.image_card_banner', imageSrc);
                    setValue('route.image_thumb_360', imageSrc);
                    setValue('route.image_thumb_240', imageSrc);
                    setValue('route.image_thumb_120', imageSrc);
                  }
                }}
                accept={{ 'image/jpeg': [], 'image/png': [] }}
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
