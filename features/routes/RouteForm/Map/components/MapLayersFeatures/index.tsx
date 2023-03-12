import { FC, MutableRefObject, useState } from 'react';
import {
  FieldArrayWithId,
  UseFieldArrayAppend,
  UseFieldArrayMove,
  UseFieldArrayRemove,
  UseFieldArrayUpdate,
} from 'react-hook-form';
import type { Map } from 'mapbox-gl';
import { Position } from 'geojson';
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
import {
  createAlphaNumericId,
  GPXParser,
  readFile,
  roundToDecimalCount,
} from '@/utils';
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
                          const coordinates = [
                            roundToDecimalCount(waypoint.lon, {
                              decimalCount: 6,
                            }),
                            roundToDecimalCount(waypoint.lat, {
                              decimalCount: 6,
                            }),
                          ];

                          if (typeof waypoint.ele === 'number') {
                            // TODO: Elevation is supposed to be meters, but could be feet
                            coordinates.push(
                              roundToDecimalCount(waypoint.ele, {
                                decimalCount: 3,
                              })
                            );
                          } else {
                            // get elevation
                            const ele = await getElevationByLngLat(
                              coordinates as LngLat
                            );

                            if (typeof ele === 'number') {
                              // TODO: Might need to convert feet to meters
                              coordinates.push(
                                roundToDecimalCount(ele, {
                                  decimalCount: 3,
                                })
                              );
                            }
                          }

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
                              description: waypoint.desc || waypoint.cmt || '',
                            },
                          };

                          features.push(
                            mapMapFeatureToFeatureValues(mapFeature)
                          );
                        }
                      );

                      await Promise.all(waypointsPromiseArray);

                      const routesPromiseArray = gpx.routes.map(async (rte) => {
                        const coordinatesPromiseArray = rte.points.map(
                          async ({ lat, lon, ele }) => {
                            const position: Position = [lon, lat];

                            if (typeof ele === 'number') {
                              // TODO: Elevation is supposed to be meters, but could be feet
                              position.push(
                                roundToDecimalCount(ele, {
                                  decimalCount: 3,
                                })
                              );
                            } else {
                              // get elevation
                              const ele = await getElevationByLngLat(
                                position as LngLat
                              );

                              if (typeof ele === 'number') {
                                // TODO: Might need to convert feet to meters
                                position.push(
                                  roundToDecimalCount(ele, {
                                    decimalCount: 3,
                                  })
                                );
                              }
                            }

                            return position;
                          }
                        );

                        const coordinates = await Promise.all(
                          coordinatesPromiseArray
                        );

                        let mapFeature: MapFeature = {
                          id: createAlphaNumericId(24),
                          type: 'Feature',
                          geometry: {
                            type: GeometryTypeNames.LineString,
                            coordinates,
                          },
                          properties: {
                            layer: newLayerId,
                            order: features.length,
                            title: rte.name || '',
                            distance:
                              typeof rte.distance.total === 'number'
                                ? roundToDecimalCount(
                                    rte.distance.total / 1000,
                                    { decimalCount: 3 }
                                  )
                                : undefined,
                            description: rte.desc || rte.cmt || '',
                          },
                        };

                        if (
                          typeof mapFeature.properties.distance !== 'number'
                        ) {
                          mapFeature = {
                            ...mapFeature,
                            properties: {
                              ...mapFeature.properties,
                              distance: calculateLineStringDistance(mapFeature),
                            },
                          };
                        }

                        // truncate coordinates
                        mapFeature = truncateGeometryCoordinates(mapFeature);

                        features.push(mapMapFeatureToFeatureValues(mapFeature));
                      });

                      await Promise.all(routesPromiseArray);

                      const tracksPromiseArray = gpx.tracks.map(async (trk) => {
                        const coordinatesPromiseArray = trk.points.map(
                          async ({ lat, lon, ele }) => {
                            const position: Position = [lon, lat];

                            if (typeof ele === 'number') {
                              // TODO: Elevation is supposed to be meters, but could be feet
                              position.push(
                                roundToDecimalCount(ele, {
                                  decimalCount: 3,
                                })
                              );
                            } else {
                              // get elevation
                              const ele = await getElevationByLngLat(
                                position as LngLat
                              );

                              if (typeof ele === 'number') {
                                // TODO: Might need to convert feet to meters
                                position.push(
                                  roundToDecimalCount(ele, {
                                    decimalCount: 3,
                                  })
                                );
                              }
                            }

                            return position;
                          }
                        );

                        const coordinates = await Promise.all(
                          coordinatesPromiseArray
                        );

                        let mapFeature: MapFeature = {
                          id: createAlphaNumericId(24),
                          type: 'Feature',
                          geometry: {
                            type: GeometryTypeNames.LineString,
                            coordinates,
                          },
                          properties: {
                            layer: newLayerId,
                            order: features.length,
                            title: trk.name || '',
                            distance:
                              typeof trk.distance.total === 'number'
                                ? roundToDecimalCount(
                                    trk.distance.total / 1000,
                                    { decimalCount: 3 }
                                  )
                                : undefined,
                            description: trk.desc || trk.cmt || '',
                          },
                        };

                        if (
                          typeof mapFeature.properties.distance !== 'number'
                        ) {
                          mapFeature = {
                            ...mapFeature,
                            properties: {
                              ...mapFeature.properties,
                              distance: calculateLineStringDistance(mapFeature),
                            },
                          };
                        }

                        // truncate coordinates
                        mapFeature = truncateGeometryCoordinates(mapFeature);

                        features.push(mapMapFeatureToFeatureValues(mapFeature));
                      });

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
