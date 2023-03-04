import { FC } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { LngLatBounds } from 'mapbox-gl';

import { styled } from '@/styles';
import { Route } from '@/types';
import { RouteFormValues } from '../helpers';
import { MapLayersFeatures, Search } from './components';
import { useMap } from './hooks';

type MapProps = {
  routeId: Route['id'];
  routeMapBounds?: LngLatBounds | null;
};

export const Map: FC<MapProps> = ({ routeId, routeMapBounds }) => {
  const { control } = useFormContext<RouteFormValues>();

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'layers',
  });

  const { mapContainerEl, map, draw, openPopup, setActiveLayerId } = useMap({
    append,
    update,
    routeId,
    routeMapBounds,
  });

  return (
    <StyledMap>
      <Search
        append={append}
        update={update}
        map={map}
        draw={draw}
        setActiveLayerId={setActiveLayerId}
      />
      <div id='map-container' ref={mapContainerEl} />
      <MapLayersFeatures
        fields={fields}
        append={append}
        remove={remove}
        openPopup={openPopup}
        setActiveLayerId={setActiveLayerId}
      />
    </StyledMap>
  );
};

const StyledMap = styled('div', {
  boxSizing: 'border-box',
  position: 'relative',
  overflow: 'hidden',
  display: 'grid',
  width: '$full',
  borderWidth: '$1',
  borderStyle: 'solid',
  borderColor: '$slate-300',
  borderRadius: '$xl',
  '& > div#map-container': {
    width: '$full',
    height: 'calc(540px - ($borderWidths$1 + $borderWidths$1))',
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
