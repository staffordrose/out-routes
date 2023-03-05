import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { TruncatedText } from '@/components/atoms';
import {
  MarkdownEditorField,
  SelectField,
  TextField,
} from '@/components/molecules';
import { countrySelectOptions } from '@/data/general';
import { activityTypeSelectOptions } from '@/data/routes';
import { styled } from '@/styles';
import { RouteFormValues } from '../helpers';
import { ImageField } from './ImageField';
import { TitleAltFieldArray } from './TitleAltFieldArray';

export const DetailsFields: FC = () => {
  const { control } = useFormContext<RouteFormValues>();

  return (
    <StyledDetailsFields>
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
      <FullWidthGrid>
        <Controller
          name='route.summary'
          control={control}
          render={({ field, fieldState: { isTouched, error } }) => (
            <MarkdownEditorField
              {...field}
              label='Summary'
              placeholder='Route summary...'
              isTouched={isTouched}
              error={error?.message}
            />
          )}
        />
      </FullWidthGrid>
    </StyledDetailsFields>
  );
};

const StyledDetailsFields = styled('div', {
  width: '$full',
  maxWidth: '$container_xl',
  marginX: '$auto',
  paddingTop: '$2_5',
  '@sm': {
    paddingTop: '$3',
  },
  '@md': {
    paddingTop: '$3_5',
  },
  '@lg': {
    paddingTop: '$4',
  },
});

const ResponsiveGrid = styled('div', {
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '$2_5',
  marginBottom: '$2_5',
  paddingX: '$4',
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

const FullWidthGrid = styled('div', {
  display: 'grid',
  gridTemplateColumns: '1fr',
  marginBottom: '$2_5',
  paddingX: '$4',
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
