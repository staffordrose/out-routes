import { FC } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { styled } from '@/styles';
import { Route } from '@/types';
import { RouteFormValues } from '../helpers';
import { MapLayersFeatures } from './components';
import { useMap } from './hooks';

type MapProps = {
  routeId: Route['id'];
};

export const Map: FC<MapProps> = ({ routeId }) => {
  const { control } = useFormContext<RouteFormValues>();

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'layers',
  });

  const { mapContainerEl, openPopup } = useMap({
    routeId,
    update,
  });

  return (
    <StyledMap>
      <div ref={mapContainerEl} />
      <MapLayersFeatures
        fields={fields}
        append={append}
        remove={remove}
        openPopup={openPopup}
      />
    </StyledMap>
  );
};

const StyledMap = styled('div', {
  overflow: 'hidden',
  boxSizing: 'border-box',
  display: 'grid',
  width: '$full',
  borderWidth: '$2',
  borderStyle: 'dashed',
  borderColor: '$slate-200',
  borderRadius: '$xl',
  '& > div:first-child': {
    width: '$full',
    height: 'calc(540px - ($borderWidths$2 + $borderWidths$2))',
    backgroundColor: '$slate-200',
  },
  '& > div:last-child': {
    overflowY: 'auto',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  '@md': {
    height: 540,
    gridTemplateColumns: '1fr $64',
  },
  '@lg': {
    gridTemplateColumns: '1fr $76',
  },
});
