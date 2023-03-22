import { FC, useCallback, useMemo, useState } from 'react';
import {
  BiDotsVerticalRounded,
  BiExport,
  BiMessageAltError,
} from 'react-icons/bi';

import {
  Button,
  Callout,
  Dialog,
  DropdownMenu,
  Flex,
  IconButton,
  Select,
  Text,
} from '@/components/atoms';
import { nonStandardColorCodes, NonStandardColorNames } from '@/data/general';
import { styled } from '@/styles';
import { LngLat } from '@/types/maps';
import { Route, RouteFeature, RouteLayer } from '@/types/routes';
import {
  getAllCoordinatesFromMapLayers,
  getMapBoundsFromCoordinates,
  GPXGenerator,
  mapLayerAndFeatureRecordsToMapboxLayer,
} from '@/utils';

enum ExportFileFormats {
  GPX_ROUTES = 'gpx-routes',
  GPX_TRACKS = 'gpx-tracks',
}

enum ExportFileFormatLabels {
  GPX_ROUTES = 'GPX - Routes',
  GPX_TRACKS = 'GPX - Tracks',
}

const exportFileFormats: Record<ExportFileFormats, ExportFileFormats> = {
  [ExportFileFormats.GPX_ROUTES]: ExportFileFormats.GPX_ROUTES,
  [ExportFileFormats.GPX_TRACKS]: ExportFileFormats.GPX_TRACKS,
};

type HeaderProps = {
  route: Route;
  layers: RouteLayer[];
  features: RouteFeature[];
};

export const Header: FC<HeaderProps> = ({ route, layers, features }) => {
  const [isExportDialogOpen, setExportDialogOpen] = useState<boolean>(false);
  const [exportFileFormat, setExportFileFormat] = useState<ExportFileFormats>();

  const hasNonStandardGpxColor = useMemo(() => {
    return (
      layers.some(
        ({ color }) =>
          color && nonStandardColorCodes[color as NonStandardColorNames]
      ) ||
      features.some(
        ({ color }) =>
          color && nonStandardColorCodes[color as NonStandardColorNames]
      )
    );
  }, [layers, features]);

  const downloadGpx = useCallback(
    (exportFileFormat?: ExportFileFormats) => {
      const mapLayers = layers.map((layer) =>
        mapLayerAndFeatureRecordsToMapboxLayer(
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
        route.activity_type,
        mapLayers,
        {
          fileName: route.title || '',
          format:
            exportFileFormat === ExportFileFormats.GPX_TRACKS
              ? 'track'
              : 'route',
        }
      );
      return result.download();
    },
    [route, layers, features]
  );

  return (
    <StyledHeader>
      <Dialog
        maxWidth='xs'
        isOpen={isExportDialogOpen}
        setOpen={setExportDialogOpen}
        title='Export Map'
        body={
          <Flex direction='column' gap='lg' width='full'>
            {[
              ExportFileFormats.GPX_ROUTES,
              ExportFileFormats.GPX_TRACKS,
            ].includes(exportFileFormat as ExportFileFormats) &&
              hasNonStandardGpxColor && (
                <Callout colorScheme='orange'>
                  <BiMessageAltError />
                  <span>
                    <Text as='span' fontWeight='medium'>
                      Note:
                    </Text>{' '}
                    One or more sections / features in this map use colors that
                    are not supported by GPX files. The unsupported colors will
                    not be saved.
                  </span>
                </Callout>
              )}
            <p>Select the file format that you want to export.</p>
            <Select
              placeholder='Select file format'
              value={exportFileFormat}
              onValueChange={(value) => {
                if (exportFileFormats[value as ExportFileFormats]) {
                  setExportFileFormat(value as ExportFileFormats);
                }
              }}
              groups={[
                {
                  id: 'options',
                  options: [
                    {
                      value: ExportFileFormats.GPX_ROUTES,
                      label: ExportFileFormatLabels.GPX_ROUTES,
                    },
                    {
                      value: ExportFileFormats.GPX_TRACKS,
                      label: ExportFileFormatLabels.GPX_TRACKS,
                    },
                  ],
                },
              ]}
            />
            <Flex justifyContent='end' width='full'>
              <Button
                variant='solid'
                colorScheme='orange'
                size='lg'
                disabled={!exportFileFormat}
                onClick={() => {
                  if (
                    [
                      ExportFileFormats.GPX_ROUTES,
                      ExportFileFormats.GPX_TRACKS,
                    ].includes(exportFileFormat as ExportFileFormats)
                  ) {
                    downloadGpx(exportFileFormat);
                  }

                  setExportDialogOpen(false);
                }}
              >
                Download
              </Button>
            </Flex>
          </Flex>
        }
      />
      <DropdownMenu
        items={[
          <DropdownMenu.Item
            key='export-map'
            size='md'
            onSelect={() => setExportDialogOpen(true)}
          >
            <BiExport />
            <span>Export Map</span>
          </DropdownMenu.Item>,
        ]}
      >
        <IconButton variant='ghost' aria-label='Open map actions menu'>
          <BiDotsVerticalRounded />
        </IconButton>
      </DropdownMenu>
    </StyledHeader>
  );
};

const StyledHeader = styled('div', {
  position: 'sticky',
  top: 0,
  zIndex: 100,
  display: 'flex',
  gap: '$2',
  justifyContent: 'flex-end',
  alignItems: 'center',
  width: '$full',
  height: '$12',
  paddingX: '$2',
  borderBottomWidth: '$1',
  borderBottomStyle: 'solid',
  borderBottomColor: '$slate-300',
  backgroundColor: '$slate-50',
});
