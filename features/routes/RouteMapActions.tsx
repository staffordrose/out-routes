import { FC, useCallback } from 'react';
import { BiCaretDownCircle } from 'react-icons/bi';

import { Button, DropdownMenu } from '@/components/atoms';
import { styled } from '@/styles';
import { LngLat, Route, RouteFeature, RouteLayer } from '@/types';
import {
  getAllCoordinatesFromMapLayers,
  getMapBoundsFromCoordinates,
  GPXGenerator,
  mapLayerRecordToMapLayer,
} from '@/utils';

type RouteMapActionsProps = {
  route: Route;
  layers: RouteLayer[];
  features: RouteFeature[];
};

export const RouteMapActions: FC<RouteMapActionsProps> = ({
  route,
  layers,
  features,
}) => {
  const downloadGpx = useCallback(() => {
    const mapLayers = layers.map((layer) =>
      mapLayerRecordToMapLayer(
        layer,
        features.filter((feature) => layer.id === feature.layer?.id)
      )
    );

    let mapBounds: LngLat[] | null = route.map_bounding_box
      ? JSON.parse(route.map_bounding_box)
      : null;

    // get map bounds from coordinates
    if (
      !Array.isArray(mapBounds) ||
      mapBounds.length !== 2 ||
      !mapBounds.every(
        (lngLat) =>
          typeof lngLat[0] === 'number' && typeof lngLat[1] === 'number'
      )
    ) {
      const coordinates = getAllCoordinatesFromMapLayers(mapLayers);
      mapBounds = getMapBoundsFromCoordinates(coordinates) as LngLat[] | null;
    }

    if (!Array.isArray(mapBounds) || mapBounds.length !== 2) {
      return;
    }

    const result = new GPXGenerator(
      {
        name: route.title,
        time: new Date(),
        bounds: mapBounds,
      },
      mapLayers,
      {
        fileName: route.title || '',
      }
    );
    return result.download();
  }, [route, layers, features]);

  return (
    <StyledRouteMapActions>
      <div />
      <DropdownMenu
        items={[
          <DropdownMenu.Item key='download-gpx' onSelect={downloadGpx}>
            Download GPX File
          </DropdownMenu.Item>,
        ]}
      >
        <Button size='md' aria-label='Open map actions menu'>
          <span>Actions</span>
          <BiCaretDownCircle />
        </Button>
      </DropdownMenu>
    </StyledRouteMapActions>
  );
};

const StyledRouteMapActions = styled('div', {
  display: 'grid',
  gap: '$4',
  width: '$full',
  marginBottom: '$4',
  '& > *:last-child': {
    justifySelf: 'flex-end',
  },
  '@md': {
    gridTemplateColumns: '1fr $48',
  },
  '@lg': {
    gridTemplateColumns: '1fr $64',
  },
});
