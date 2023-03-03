import { FC, useState } from 'react';
import {
  FieldArrayWithId,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
} from 'react-hook-form';
import { BiImport, BiPlus } from 'react-icons/bi';

import { Button, Dialog, Dropzone, List } from '@/components/atoms';
import { ColorCodes } from '@/data/general';
import { GeometryTypeNames, SymbolCodes } from '@/data/routes';
import { getElevationByLngLat } from '@/lib/v1/api/map';
import { styled } from '@/styles';
import { LngLat, MapFeature, MapLayer, PopupState } from '@/types';
import { createAlphaNumericId, GPXParser, readFile } from '@/utils';
import {
  FeatureValues,
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
  remove: UseFieldArrayRemove;
  openPopup: (popupState: PopupState) => void;
  setActiveLayerId: (id: MapLayer['id'] | null) => void;
};

export const MapLayersFeatures: FC<MapLayersFeaturesProps> = ({
  fields,
  append,
  remove,
  openPopup,
  setActiveLayerId,
}) => {
  const [isDialogOpen, setDialogOpen] = useState(false);

  return (
    <div>
      <List as='ul' direction='column' width='full'>
        {fields.map((item, index) => {
          return (
            <Layer
              key={item.id}
              remove={remove}
              setActiveLayerId={setActiveLayerId}
              item={item}
              layerIndex={index}
              openPopup={openPopup}
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
          Add Layer
        </Button>
        <Dialog
          isOpen={isDialogOpen}
          setOpen={setDialogOpen}
          title='Upload a GPX File'
          body={
            <Dropzone
              aspectRatio={16 / 9}
              onFileDrop={async ([file]: File[]) => {
                try {
                  const fileContents = await readFile(file);

                  const gpx = new GPXParser(fileContents as string);

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
                          description: waypoint.desc || '',
                        },
                      };

                      // truncate coordinates
                      mapFeature = truncateGeometryCoordinates(mapFeature);

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

                      features.push(mapMapFeatureToFeatureValues(mapFeature));
                    }
                  );

                  await Promise.all(waypointsPromiseArray);

                  const tracksPromiseArray = gpx.tracks.map(async (track) => {
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
                        description: track.desc || '',
                      },
                    };

                    // truncate coordinates
                    mapFeature = truncateGeometryCoordinates(mapFeature);

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
                        ele_start,
                        ele_end,
                        distance: calculateLineStringDistance(mapFeature),
                      },
                    };

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
                    console.log('Error uploading file: ', error.message);
                  }
                }
              }}
              accept={{ 'text/xml': ['.gpx'] }}
            />
          }
        >
          <Button
            type='button'
            size='xs'
            display='flex'
            aria-label='Open modal to import layer'
          >
            <BiImport />
            Import Layer
          </Button>
        </Dialog>
      </AddLayer>
    </div>
  );
};

const AddLayer = styled('div', {
  display: 'flex',
  gap: '$2',
  justifyContent: 'flex-start',
  alignItems: 'center',
  minHeight: '$12',
  padding: '$2',
  paddingLeft: '$3_5',
});
