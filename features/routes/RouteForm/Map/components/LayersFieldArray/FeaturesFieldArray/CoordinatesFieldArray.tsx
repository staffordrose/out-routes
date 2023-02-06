import { FC } from 'react';
import { Control, Controller, useFieldArray, useWatch } from 'react-hook-form';
import { BiMinusCircle, BiPlus } from 'react-icons/bi';

import { Button, Flex, IconButton, List } from '@/components/atoms';
import { TextField } from '@/components/molecules';
import { GeometryTypes } from '@/data/routes';
import { RouteFormValues } from '../../../../helpers';

type CoordinatesFieldArrayProps = {
  control: Control<RouteFormValues>;
  layerIndex: number;
  featureIndex: number;
};

export const CoordinatesFieldArray: FC<CoordinatesFieldArrayProps> = ({
  control,
  layerIndex,
  featureIndex,
}) => {
  const feature = useWatch({
    control,
    name: `layers.${layerIndex}.features.${featureIndex}`,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: `layers.${layerIndex}.features.${featureIndex}.coordinates`,
  });

  return (
    <Flex
      direction='column'
      gap='xs'
      width='full'
      css={{
        padding: '$2',
        borderRadius: '$md',
        backgroundColor: '$slate-200',
      }}
    >
      <List as='ul' direction='column' gap='xs' width='full'>
        {fields
          .filter((_, index) =>
            feature?.type && feature.type === GeometryTypes.Point
              ? index === 0
              : true
          )
          .map((item, index) => {
            return (
              <Flex
                key={item.id}
                as='li'
                gap='xs'
                alignItems='center'
                width='full'
              >
                <Flex gap='xs' alignItems='center' width='full'>
                  <Controller
                    name={`layers.${layerIndex}.features.${featureIndex}.coordinates.${index}.lat`}
                    control={control}
                    render={({ field, fieldState: { isTouched, error } }) => (
                      <TextField
                        {...field}
                        placeholder='Latitude'
                        isTouched={isTouched}
                        error={error?.message}
                        css={{ backgroundColor: '$white' }}
                      />
                    )}
                  />
                  <Controller
                    name={`layers.${layerIndex}.features.${featureIndex}.coordinates.${index}.lng`}
                    control={control}
                    render={({ field, fieldState: { isTouched, error } }) => (
                      <TextField
                        {...field}
                        placeholder='Longitude'
                        isTouched={isTouched}
                        error={error?.message}
                        css={{ backgroundColor: '$white' }}
                      />
                    )}
                  />
                </Flex>
                {feature?.type && feature.type !== GeometryTypes.Point && (
                  <IconButton
                    size='xs'
                    type='button'
                    variant='ghost'
                    onClick={() => {
                      remove(index);
                    }}
                  >
                    <BiMinusCircle />
                  </IconButton>
                )}
              </Flex>
            );
          })}
      </List>
      {feature?.type && feature.type !== GeometryTypes.Point && (
        <Button
          size='xs'
          display='flex'
          type='button'
          onClick={() => append({ lat: '', lng: '' })}
        >
          <BiPlus />
          Add Coordinates
        </Button>
      )}
    </Flex>
  );
};
