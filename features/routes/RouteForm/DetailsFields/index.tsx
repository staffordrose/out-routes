import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { TruncatedText } from '@/components/atoms';
import { SelectField, TextField } from '@/components/molecules';
import { countrySelectOptions } from '@/data/general';
import { activityTypeSelectOptions } from '@/data/routes';
import { styled } from '@/styles';
import { ImageField } from './ImageField';
import { TitleAltFieldArray } from './TitleAltFieldArray';
import { RouteFormValues } from '../helpers';

export const DetailsFields: FC = () => {
  const { control } = useFormContext<RouteFormValues>();

  return (
    <>
      <ImageField />
      <ResponsiveGrid>
        <Controller
          name='route.is_private'
          control={control}
          render={({ field, fieldState: { isTouched, error } }) => (
            <SelectField
              {...field}
              label='Visibility'
              placeholder='Select visibility'
              isTouched={isTouched}
              error={error?.message}
              groups={[
                {
                  id: 'visibilities',
                  label: 'Visibilities',
                  options: [
                    {
                      value: 'private',
                      label: <TruncatedText>Private</TruncatedText>,
                    },
                    {
                      value: 'public',
                      label: <TruncatedText>Public</TruncatedText>,
                    },
                  ],
                },
              ]}
            />
          )}
        />
      </ResponsiveGrid>
      <ResponsiveGrid>
        <Controller
          name='route.title'
          control={control}
          rules={{ maxLength: 60 }}
          render={({ field, fieldState: { isTouched, error } }) => (
            <TextField
              {...field}
              label='Title'
              placeholder='The Narrows'
              isTouched={isTouched}
              error={error?.message}
            />
          )}
        />
        <Controller
          name='route.activity_type'
          control={control}
          render={({ field, fieldState: { isTouched, error } }) => (
            <SelectField
              {...field}
              label='Activity Type'
              placeholder='Select activity'
              isTouched={isTouched}
              error={error?.message}
              groups={[
                {
                  id: 'activities',
                  label: 'Activities',
                  options: activityTypeSelectOptions.map(
                    ({ value, label }) => ({
                      value,
                      label: <TruncatedText>{label}</TruncatedText>,
                    })
                  ),
                },
              ]}
            />
          )}
        />
        <Controller
          name='route.region'
          control={control}
          rules={{ maxLength: 60 }}
          render={({ field, fieldState: { isTouched, error } }) => (
            <TextField
              {...field}
              label='Region'
              placeholder='Zion National Park'
              isTouched={isTouched}
              error={error?.message}
            />
          )}
        />
        <Controller
          name='route.country'
          control={control}
          render={({ field, fieldState: { isTouched, error } }) => (
            <SelectField
              {...field}
              label='Country'
              placeholder='Select country'
              isTouched={isTouched}
              error={error?.message}
              groups={[
                {
                  id: 'countries',
                  label: 'Countries',
                  options: countrySelectOptions.map(({ value, label }) => ({
                    value,
                    label: <TruncatedText>{label}</TruncatedText>,
                  })),
                },
              ]}
            />
          )}
        />
      </ResponsiveGrid>
      <ResponsiveGrid>
        <TitleAltFieldArray />
      </ResponsiveGrid>
    </>
  );
};

const ResponsiveGrid = styled('div', {
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '$2_5',
  marginBottom: '$2_5',
  '@sm': {
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '$3',
    marginBottom: '$3',
  },
  '@md': {
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '$3_5',
    marginBottom: '$3_5',
  },
  '@lg': {
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '$4',
    marginBottom: '$4',
  },
});
