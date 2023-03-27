import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { MarkdownEditorField } from '@/components/molecules';
import { styled } from '@/styles';
import { RouteFormValues } from './helpers';

export const SummaryTab: FC = () => {
  const { control } = useFormContext<RouteFormValues>();

  return (
    <StyledSummaryTab>
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
    </StyledSummaryTab>
  );
};

const StyledSummaryTab = styled('div', {
  width: '$full',
  maxWidth: '$container_xl',
  marginX: '$auto',
  marginY: '$2_5',
  paddingX: '$4',
  '@sm': {
    marginY: '$3',
  },
  '@md': {
    marginY: '$3_5',
  },
  '@lg': {
    marginY: '$4',
  },
});
