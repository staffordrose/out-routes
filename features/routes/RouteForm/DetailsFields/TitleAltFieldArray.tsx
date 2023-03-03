import { FC } from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { BiMinusCircle } from 'react-icons/bi';

import { Button, Flex, IconButton, Label, List } from '@/components/atoms';
import { TextField } from '@/components/molecules';
import { styled } from '@/styles';
import { RouteFormValues } from '../helpers';

export const TitleAltFieldArray: FC = () => {
  const { control } = useFormContext<RouteFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'route.title_alt',
  });

  return (
    <StyledTitleAltFieldArray>
      <Label htmlFor='route.title_alt'>Alternate Names</Label>
      {Array.isArray(fields) && fields.length > 0 && (
        <List
          as='ul'
          direction='column'
          gap='sm'
          width='full'
          css={{ marginBottom: fields.length < 3 ? '$2' : undefined }}
        >
          {fields.map((item, index) => {
            return (
              <Flex key={item.id} as='li' gap='sm' width='full'>
                <Controller
                  name={`route.title_alt.${index}.text` as const}
                  control={control}
                  render={({ field, fieldState: { isTouched, error } }) => (
                    <TextField
                      {...field}
                      placeholder='The Narrows'
                      isTouched={isTouched}
                      error={error?.message}
                    />
                  )}
                />
                <IconButton
                  type='button'
                  variant='ghost'
                  onClick={() => remove(index)}
                  css={{ flexShrink: 0 }}
                >
                  <BiMinusCircle />
                </IconButton>
              </Flex>
            );
          })}
        </List>
      )}
      {Array.isArray(fields) && fields.length < 3 && (
        <Button
          type='button'
          display='flex'
          onClick={() => append({ text: '' })}
        >
          Add Name
        </Button>
      )}
    </StyledTitleAltFieldArray>
  );
};

const StyledTitleAltFieldArray = styled('div', {
  padding: '$2',
  paddingTop: 0,
  width: '$full',
  borderRadius: '$md',
  backgroundColor: '$slate-100',
  '& input': {
    backgroundColor: '$white',
  },
});
