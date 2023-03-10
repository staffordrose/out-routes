import { FC, MutableRefObject, useState } from 'react';
import {
  FieldArrayWithId,
  UseFieldArrayAppend,
  UseFieldArrayMove,
  UseFieldArrayRemove,
  UseFieldArrayUpdate,
} from 'react-hook-form';
import type { Map } from 'mapbox-gl';
import { BiError, BiImport, BiPlus } from 'react-icons/bi';

import {
  Button,
  Dialog,
  Dropzone,
  Flex,
  Icon,
  List,
  Text,
} from '@/components/atoms';
import { Feedback } from '@/components/layout';
import { ColorCodes } from '@/data/general';
import {
  GeometryTypeNames,
  SymbolCodes,
  symbolCodes,
  SymbolLabels,
  symbolLabelsToCodes,
} from '@/data/routes';
import { getElevationByLngLat } from '@/lib/v1/api/map';
import { styled } from '@/styles';
import { LngLat, MapFeature, MapLayer, PopupState } from '@/types/maps';
import { createAlphaNumericId, GPXParser, readFile } from '@/utils';
import {
  FeatureValues,
  LayerValues,
  mapMapFeatureToFeatureValues,
  RouteFormValues,
} from '../../../helpers';
import {
  calculateLineStringDistance,
  truncateGeometryCoordinates,
} from '../../helpers';
import { Layer } from './Layer';

type MapLayersFeaturesProps = {
  fields: FieldArrayWithId<RouteFormValues, 'layers', 'id'>[];
  append: UseFieldArrayAppend<RouteFormValues, 'layers'>;
  move: UseFieldArrayMove;
  remove: UseFieldArrayRemove;
  update: UseFieldArrayUpdate<RouteFormValues, 'layers'>;
  map: MutableRefObject<Map | undefined>;
  setActiveLayerId: (id: MapLayer['id'] | null) => void;
  openPopup: (popupState: PopupState) => void;
  closePopup: () => void;
  openFeatureEditDialog: (
    layerIndex: number,
    layer: LayerValues,
    feature: MapFeature
  ) => void;
};

export const MapLayersFeatures: FC<MapLayersFeaturesProps> = ({
  fields,
  append,
  move,
  remove,
  update,
  map,
  setActiveLayerId,
  openPopup,
  closePopup,
  openFeatureEditDialog,
}) => {
  const [isDialogOpen, setDialogOpen] = useState(false);

  const [isDropzoneLoading, setDropzoneLoading] = useState(false);
  const [dropzoneError, setDropzoneError] = useState<string>('');

  const [layersWithFeaturesReordering, setLayersWithFeaturesReordering] =
    useState<Set<LayerValues['databaseId']>>(new Set());

  const toggleLayerFeaturesReordering = (
    layerId: LayerValues['databaseId']
  ) => {
    const next = new Set(layersWithFeaturesReordering);

    if (next.has(layerId)) {
      next.delete(layerId);
    } else {
      next.add(layerId);
    }

    setLayersWithFeaturesReordering(next);
  };

  return (
    <StyledMapLayersFeatures>
      <List as='ul' direction='column' width='full'>
        {fields.map((item, index) => {
          return (
            <Layer
              key={item.id}
              move={move}
              remove={remove}
              update={update}
              map={map}
              item={item}
              layersCount={fields.length}
              layerIndex={index}
              setActiveLayerId={setActiveLayerId}
              openPopup={openPopup}
              closePopup={closePopup}
              openFeatureEditDialog={openFeatureEditDialog}
              layersWithFeaturesReordering={layersWithFeaturesReordering}
              toggleLayerFeaturesReordering={toggleLayerFeaturesReordering}
            />
          );
        })}
      </List>
      <AddLayer>
        <Button
          type='button'
          size='xs'
          display='flex'
          onClick={() => {
            const newLayerId = createAlphaNumericId(24);

            append({
              databaseId: newLayerId,
              title: '',
              color: ColorCodes.Red,
              symbol: SymbolCodes.Marker,
            });

            setActiveLayerId(newLayerId);
          }}
        >
          <BiPlus />
          Add Section
        </Button>
        <Dialog
          isOpen={isDialogOpen}
          setOpen={setDialogOpen}
          title='Upload a GPX File'
          body={
            <Flex direction='column' gap='md' width='full'>
              {isDropzoneLoading ? (
                <Feedback type='loading' title='Parsing File' />
              ) : (
                <Dropzone
                  aspectRatio={3 / 2}
                  onFileDrop={async ([file]: File[]) => {
                    setDropzoneError('');
                    setDropzoneLoading(true);

                    try {
                      const fileContents = await readFile(file);

                      const gpx = new GPXParser(fileContents as string);

                      if (gpx.error instanceof Error) {
                        throw new Error(gpx.error.message);
                      }

                      const newLayerId = createAlphaNumericId(24);

                      const features: FeatureValues[] = [];

                      const waypointsPromiseArray = gpx.waypoints.map(
                        async (waypoint) => {
                          const coordinates = [waypoint.lon, waypoint.lat];

                          let mapFeature: MapFeature = {
                            id: createAlphaNumericId(24),
                            type: 'Feature',
                            geometry: {
                              type: GeometryTypeNames.Point,
                              coordinates,
                            },
                            properties: {
                              layer: newLayerId,
                              order: features.length,
                              title: waypoint.name || '',
                              symbol: waypoint.sym
                                ? symbolCodes[waypoint.sym as SymbolCodes] ||
                                  symbolLabelsToCodes[
                                    waypoint.sym as SymbolLabels
                                  ] ||
                                  undefined
                                : undefined,
                              ele_start: waypoint.ele || undefined,
                              ele_end: waypoint.ele || undefined,
                              description: waypoint.desc || waypoint.cmt || '',
                            },
                          };

                          // truncate coordinates
                          mapFeature = truncateGeometryCoordinates(mapFeature);

                          // calculate elevation
                          if (!mapFeature.properties.ele_start) {
                            const ele = await getElevationByLngLat(
                              coordinates as LngLat
                            );

                            // add elevation to properties
                            mapFeature = {
                              ...mapFeature,
                              properties: {
                                ...mapFeature.properties,
                                ele_start: ele,
                                ele_end: ele,
                              },
                            };
                          }

                          features.push(
                            mapMapFeatureToFeatureValues(mapFeature)
                          );
                        }
                      );

                      await Promise.all(waypointsPromiseArray);

                      const tracksPromiseArray = gpx.tracks.map(
                        async (track) => {
                          let mapFeature: MapFeature = {
                            id: createAlphaNumericId(24),
                            type: 'Feature',
                            geometry: {
                              type: GeometryTypeNames.LineString,
                              coordinates: track.points.map(({ lat, lon }) => [
                                lon,
                                lat,
                              ]),
                            },
                            properties: {
                              layer: newLayerId,
                              order: features.length,
                              title: track.name || '',
                              ele_start: track.points[0].ele || undefined,
                              ele_end:
                                track.points[track.points.length - 1].ele ||
                                undefined,
                              description: track.desc || track.cmt || '',
                            },
                          };

                          // truncate coordinates
                          mapFeature = truncateGeometryCoordinates(mapFeature);

                          // calculate elevation
                          if (
                            !mapFeature.properties.ele_start ||
                            !mapFeature.properties.ele_end
                          ) {
                            const { coordinates } = mapFeature.geometry;

                            const ele_start = await getElevationByLngLat(
                              coordinates[0] as LngLat
                            );
                            const ele_end = await getElevationByLngLat(
                              coordinates[coordinates.length - 1] as LngLat
                            );

                            // add elevation, distance to properties
                            mapFeature = {
                              ...mapFeature,
                              properties: {
                                ...mapFeature.properties,
                                ele_start:
                                  mapFeature.properties.ele_start || ele_start,
                                ele_end:
                                  mapFeature.properties.ele_end || ele_end,
                                distance:
                                  calculateLineStringDistance(mapFeature),
                              },
                            };
                          }

                          features.push(
                            mapMapFeatureToFeatureValues(mapFeature)
                          );
                        }
                      );

                      await Promise.all(tracksPromiseArray);

                      append({
                        databaseId: newLayerId,
                        title: '',
                        color: ColorCodes.Red,
                        symbol: SymbolCodes.Marker,
                        features,
                      });

                      setActiveLayerId(newLayerId);

                      setDialogOpen(false);
                    } catch (error) {
                      if (error instanceof Error) {
                        setDropzoneError(error.message);
                      }
                    } finally {
                      setDropzoneLoading(false);
                    }
                  }}
                  accept={{ 'text/xml': ['.gpx'] }}
                />
              )}
              {!!dropzoneError && (
                <Flex
                  gap='xs'
                  justifyContent='flex-start'
                  alignItems='center'
                  css={{ color: '$red-700' }}
                >
                  <Icon as={BiError} />
                  <Text>{dropzoneError}</Text>
                </Flex>
              )}
            </Flex>
          }
        >
          <Button
            type='button'
            size='xs'
            display='flex'
            aria-label='Open modal to import file'
          >
            <BiImport />
            Import
          </Button>
        </Dialog>
      </AddLayer>
    </StyledMapLayersFeatures>
  );
};

const StyledMapLayersFeatures = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  width: '$full',
  borderTopWidth: '$1',
  borderTopStyle: 'solid',
  borderTopColor: '$slate-300',
  backgroundColor: '$white',
  '@md': {
    borderTop: 'none',
  },
});

const AddLayer = styled('div', {
  display: 'flex',
  gap: '$2',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  minHeight: '$24',
  padding: '$2',
  paddingLeft: '$3_5',
});
