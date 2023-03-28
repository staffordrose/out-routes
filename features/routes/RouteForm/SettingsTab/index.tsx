import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { TruncatedText } from '@/components/atoms';
import { SelectField, TextField } from '@/components/molecules';
import { countrySelectOptions } from '@/data/general';
import { activityTypeSelectOptions } from '@/data/routes';
import { styled } from '@/styles';
import { RouteFormValues } from '../helpers';
import { PrivacyField } from './PrivacyField';
import { TitleAltFieldArray } from './TitleAltFieldArray';

export const SettingsTab: FC = () => {
  const { control, setValue } = useFormContext<RouteFormValues>();

  return (
    <StyledSettingsTab>
      <div>
        <PrivacyField control={control} setValue={setValue} />
        <ResponsiveGrid>
          <Controller
            name='route.title'
            control={control}
            rules={{ required: true, maxLength: 60 }}
            render={({ field, fieldState: { isTouched, error } }) => (
              <TextField
                {...field}
                isRequired
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
            rules={{ required: true }}
            render={({ field, fieldState: { isTouched, error } }) => (
              <SelectField
                {...field}
                isRequired
                contentWidth='sm'
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
        </ResponsiveGrid>
        <ResponsiveGrid>
          <TitleAltFieldArray control={control} />
        </ResponsiveGrid>
        <ResponsiveGrid>
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
            rules={{ required: true }}
            render={({ field, fieldState: { isTouched, error } }) => (
              <SelectField
                {...field}
                isRequired
                contentWidth='xl'
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
      </div>
    </StyledSettingsTab>
  );
};

const StyledSettingsTab = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  placeItems: 'center',
  width: '$full',
  maxWidth: '$96',
  marginX: '$auto',
  marginTop: 'calc($7 + $2_5)',
  marginBottom: '$2_5',
  paddingX: '$4',
  '& > div': {
    display: 'flex',
    flexDirection: 'column',
    gap: '$2_5',
    width: '$full',
    padding: '$4',
    borderWidth: '$1',
    borderStyle: 'solid',
    borderColor: '$slate-200',
    borderRadius: '$xl',
  },
  '@sm': {
    marginTop: 'calc($7 + $3)',
    marginBottom: '$3',
    '& > div': {
      gap: '$3',
    },
  },
  '@md': {
    maxWidth: '560px',
    marginTop: 'calc($7 + $3_5)',
    marginBottom: '$3_5',
    '& > div': {
      gap: '$3_5',
    },
  },
  '@lg': {
    marginTop: 'calc($7 + $4)',
    marginBottom: '$4',
    '& > div': {
      gap: '$4',
    },
  },
});

const ResponsiveGrid = styled('div', {
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '$2_5',
  alignItems: 'start',
  '@sm': {
    gap: '$3',
  },
  '@md': {
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '$3_5',
  },
  '@lg': {
    gap: '$4',
  },
});
