import { FC, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { LngLatBounds } from 'mapbox-gl';

import { Dialog } from '@/components/atoms';
import { styled } from '@/styles';
import { MapFeature, Route } from '@/types';
import { LayerValues, RouteFormValues } from '../helpers';
import { FeatureEdit, MapLayersFeatures, Search } from './components';
import { useMap } from './hooks';

const initialFeatureEditProps = {
  layerIndex: 0,
  layer: {} as LayerValues,
  feature: {} as MapFeature,
};

type MapProps = {
  routeId: Route['id'];
  routeMapBounds?: LngLatBounds | null;
};

export const Map: FC<MapProps> = ({ routeId, routeMapBounds }) => {
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

  const { mapContainerEl, map, draw, openPopup, closePopup, setActiveLayerId } =
    useMap({
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
            setActiveLayerId={setActiveLayerId}
          />
          <div id='map-container' ref={mapContainerEl} />
        </div>
        <MapLayersFeatures
          fields={fields}
          append={append}
          move={move}
          remove={remove}
          update={update}
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
    height: 'calc(100vh - $14 - $8 - $14 - $12 - $24)',
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
    display: 'grid',
    gridTemplateColumns: '1fr $64',
    height: 'calc(100vh - $14 - $8 - $14 - $12)',
    '& > div:first-child': {
      height: '$full',
      borderLeftWidth: '$1',
      borderLeftStyle: 'solid',
      borderLeftColor: '$slate-300',
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
