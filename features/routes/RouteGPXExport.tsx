import { FC, useCallback, useMemo } from 'react';

import { Button, DropdownMenu } from '@/components/atoms';
import { styled } from '@/styles';
import { Route, RouteFeature, RouteLayer } from '@/types';
import { GPXGenerator, mapLayerRecordToMapLayer } from '@/utils';

import { BiCaretDownCircle } from 'react-icons/bi';
type RouteGPXExportProps = {
  route: Route;
  layers: RouteLayer[];
  features: RouteFeature[];
};

export const RouteGPXExport: FC<RouteGPXExportProps> = ({
  route,
  layers,
  features,
}) => {
  const mapLayers = useMemo(() => {
    return layers.map((layer) =>
      mapLayerRecordToMapLayer(
        layer,
        features.filter((feature) => layer.id === feature.layer?.id)
      )
    );
  }, [layers, features]);

  const downloadGpx = useCallback(() => {
    const result = new GPXGenerator(mapLayers, route.title || '');
    return result.download();
  }, [route, mapLayers]);

  return (
    <StyledRouteGPXExport>
      <div />
      <DropdownMenu
        items={[
          <DropdownMenu.Item key='download-gpx' onSelect={downloadGpx}>
            Download GPX File
          </DropdownMenu.Item>,
        ]}
      >
        <Button size='md' aria-label='Open actions menu'>
          <span>Actions</span>
          <BiCaretDownCircle />
        </Button>
      </DropdownMenu>
    </StyledRouteGPXExport>
  );
};

const StyledRouteGPXExport = styled('div', {
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
