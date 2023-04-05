import { Position } from 'geojson';

import { GeometryTypeNames } from '@/data/routes';
import { LngLat, MapFeature } from '@/types/maps';
import { MutableRefObject } from 'react';
import { Map } from 'mapbox-gl';
import { round } from '@/utils';

export const addElevationToMapFeature = (
  map: MutableRefObject<Map | undefined>,
  feature: MapFeature
): MapFeature => {
  try {
    const getPositionsWithElevation = (
      geometry: MapFeature['geometry']
    ): Position[] => {
      let coordinates = Array.from(
        geometry.type === GeometryTypeNames.Polygon
          ? geometry.coordinates[0]
          : geometry.type === GeometryTypeNames.LineString
          ? geometry.coordinates
          : [geometry.coordinates]
      ) as Position[];

      // add elevations to coordinates
      for (let i = 0; i < coordinates.length; i++) {
        const coord: LngLat = [coordinates[i][0], coordinates[i][1]];

        let ele = map.current?.queryTerrainElevation(coord);

        if (typeof ele === 'number' && !Number.isNaN(ele)) {
          ele = round(ele, 3);
        } else {
          ele = 0;
        }

        coordinates[i] = [...coord, ele];
      }

      return coordinates;
    };

    // add elevation for all positions
    if (feature.geometry.type === GeometryTypeNames.Polygon) {
      const positions = getPositionsWithElevation(feature.geometry);

      const coordinates: Position[][] = [positions];

      return {
        ...feature,
        geometry: {
          ...feature.geometry,
          coordinates,
        },
      };
    } else if (feature.geometry.type === GeometryTypeNames.LineString) {
      const coordinates = getPositionsWithElevation(feature.geometry);

      return {
        ...feature,
        geometry: {
          ...feature.geometry,
          coordinates,
        },
      };
    } else {
      const [coordinates] = getPositionsWithElevation(feature.geometry);

      return {
        ...feature,
        geometry: {
          ...feature.geometry,
          coordinates,
        },
      };
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error(
        'An unknown error occurred getting the feature elevations'
      );
    }
  }
};
