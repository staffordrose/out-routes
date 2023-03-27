import { FC, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { LngLatBounds } from 'mapbox-gl';

import { Dialog } from '@/components/atoms';
import { styled } from '@/styles';
import { MapFeature } from '@/types/maps';
import { Route } from '@/types/routes';
import { LayerValues, RouteFormValues } from '../helpers';
import {
  ElevationChart,
  FeatureEdit,
  MapLayersFeatures,
  Search,
} from './components';
import { useMap } from './hooks';

const initialFeatureEditProps = {
  layerIndex: 0,
  layer: {} as LayerValues,
  feature: {} as MapFeature,
};

type MapTabProps = {
  routeId: Route['id'];
  routeMapBounds?: LngLatBounds | null;
};

export const MapTab: FC<MapTabProps> = ({ routeId, routeMapBounds }) => {
  const { control } = useFormContext<RouteFormValues>();

  const [featureEditProps, setFeatureEditProps] = useState<{
    layerIndex: number;
    layer: LayerValues;
    feature: MapFeature;
  }>(initialFeatureEditProps);

  const [isFeatureDialogOpen, setFeatureDialogOpen] = useState<boolean>(false);

  const openFeatureEditDialog = (
    layerIndex: number,
    layer: LayerValues,
    feature: MapFeature
  ) => {
    setFeatureEditProps({
      layerIndex,
      layer,
      feature,
    });
    setFeatureDialogOpen(true);
  };

  const closeFeatureEditDialog = () => {
    setFeatureEditProps(initialFeatureEditProps);
    setFeatureDialogOpen(false);
  };

  const { fields, append, move, remove, update } = useFieldArray({
    control,
    name: 'layers',
  });

  const {
    mapContainerEl,
    map,
    draw,
    openPopup,
    closePopup,
    setTrackMarker,
    hideTrackMarker,
    setActiveLayerId,
  } = useMap({
    append,
    update,
    routeId,
    routeMapBounds,
    openFeatureEditDialog,
  });

  return (
    <>
      <Dialog
        maxWidth='sm'
        isOpen={isFeatureDialogOpen}
        setOpen={setFeatureDialogOpen}
        title='Edit Feature'
        body={
          <FeatureEdit
            {...featureEditProps}
            update={update}
            openPopup={openPopup}
            closeFeatureEditDialog={closeFeatureEditDialog}
          />
        }
      />
      <StyledMap>
        <div>
          <Search
            append={append}
            update={update}
            map={map}
            draw={draw}
            openPopup={openPopup}
            setActiveLayerId={setActiveLayerId}
          />
          <div id='map-container' ref={mapContainerEl} />
          <ElevationChart
            hideTrackMarker={hideTrackMarker}
            setTrackMarker={setTrackMarker}
          />
        </div>
        <MapLayersFeatures
          fields={fields}
          append={append}
          move={move}
          remove={remove}
          update={update}
          map={map}
          openPopup={openPopup}
          closePopup={closePopup}
          setActiveLayerId={setActiveLayerId}
          openFeatureEditDialog={openFeatureEditDialog}
        />
      </StyledMap>
    </>
  );
};

const StyledMap = styled('div', {
  boxSizing: 'border-box',
  position: 'relative',
  width: '$full',
  '& > div:first-child': {
    position: 'sticky',
    top: '$14',
    width: '$full',
    height: 'calc(100vh - $14 - $8 - $14 - $12 - $24 - 2px)',
    '& > div#map-container': {
      width: '$full',
      height: 'calc($full - $18)',
      backgroundColor: '$slate-200',
    },
    '& > div:last-child': {
      height: '$18',
      borderTopWidth: '$1',
      borderTopStyle: 'solid',
      borderTopColor: '$slate-300',
    },
  },
  '& > div:last-child': {
    position: 'relative',
    zIndex: 10,
  },
  '@md': {
    display: 'grid',
    gridTemplateColumns: '1fr $64',
    height: 'calc(100vh - $14 - $8 - $14 - $12 - 2px)',
    '& > div:first-child': {
      height: '$full',
      borderLeftWidth: '$1',
      borderLeftStyle: 'solid',
      borderLeftColor: '$slate-300',
      '& > div#map-container': {
        height: 'calc($full - $24)',
      },
      '& > div:last-child': {
        height: '$24',
      },
    },
    '& > div:last-child': {
      overflowY: 'auto',
      borderLeftWidth: '$1',
      borderLeftStyle: 'solid',
      borderLeftColor: '$slate-300',
      borderRightWidth: '$1',
      borderRightStyle: 'solid',
      borderRightColor: '$slate-300',
    },
  },
  '@lg': {
    gridTemplateColumns: '1fr $76',
  },
});
