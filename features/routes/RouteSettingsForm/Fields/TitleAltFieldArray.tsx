import { FC } from 'react';
import { Controller, useFieldArray, UseFormReturn } from 'react-hook-form';
import { BiMinusCircle } from 'react-icons/bi';

import {
  Button,
  Flex,
  IconButton,
  Label,
  List,
  Text,
} from '@/components/atoms';
import { TextField } from '@/components/molecules';
import { styled } from '@/styles';
import { RouteSettingsFormValues } from '../helpers';

type TitleAltFieldArrayProps = {
  control: UseFormReturn<RouteSettingsFormValues>['control'];
};

export const TitleAltFieldArray: FC<TitleAltFieldArrayProps> = ({
  control,
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'title_alt',
  });

  return (
    <StyledTitleAltFieldArray>
      <Label htmlFor='title_alt'>
        <span>Alternate Names</span>
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
      </Label>
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
              <Flex
                key={item.id}
                as='li'
                gap='sm'
                width='full'
                css={{
                  '& > button:last-child': {
                    flexShrink: 0,
                  },
                  '@md': {
                    '& input': {
                      maxWidth: '164px',
                    },
                  },
                }}
              >
                <Controller
                  name={`title_alt.${index}.text` as const}
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
  width: '$full',
  '& > label': {
    display: 'inline-block',
    marginBottom: '$1',
  },
});
