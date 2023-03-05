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
      <div>
        <Search
          append={append}
          update={update}
          map={map}
          draw={draw}
          setActiveLayerId={setActiveLayerId}
        />
        <div id='map-container' ref={mapContainerEl} />
      </div>
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
  display: 'grid',
  width: '$full',
  '& > div:first-child': {
    position: 'sticky',
    top: '$14',
    width: '$full',
    height: 'calc(100vh - $14 - $8 - $14 - $12 - $12)',
    '& > div#map-container': {
      width: '$full',
      height: '$full',
      backgroundColor: '$slate-200',
    },
  },
  '& > div:last-child': {
    position: 'relative',
    zIndex: 10,
  },
  '@md': {
    gridTemplateColumns: '1fr $64',
    minHeight: '100vh',
    '& > div:first-child': {
      height: 'calc(100vh - $14)',
    },
  },
  '@lg': {
    gridTemplateColumns: '1fr $76',
  },
});
