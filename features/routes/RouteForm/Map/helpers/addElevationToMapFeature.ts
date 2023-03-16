import { Position } from 'geojson';

import { GeometryTypeNames } from '@/data/routes';
import { getFeatureElevations } from '@/lib/v1/api/map';
import { MapFeature } from '@/types/maps';

export const addElevationToMapFeature = async (
  feature: MapFeature
): Promise<MapFeature> => {
  try {
    const getPositionsWithElevation = async (
      geometry: MapFeature['geometry']
    ): Promise<Position[]> => {
      let coordinates = Array.from(
        geometry.type === GeometryTypeNames.Polygon
          ? geometry.coordinates[0]
          : geometry.type === GeometryTypeNames.LineString
          ? geometry.coordinates
          : [geometry.coordinates]
      ) as Position[];

      const elevations = await getFeatureElevations(geometry);

      // add elevations to coordinates
      for (let i = 0; i < coordinates.length; i++) {
        const ele = elevations[i];
        if (typeof ele === 'number' && !Number.isNaN(ele)) {
          coordinates[i][2] = ele;
        } else {
          coordinates[i][2] = 0;
        }
      }

      return coordinates;
    };

    // add elevation for all positions
    if (feature.geometry.type === GeometryTypeNames.Polygon) {
      const positions = await getPositionsWithElevation(feature.geometry);

      const coordinates: Position[][] = [positions];

      return {
        ...feature,
        geometry: {
          ...feature.geometry,
          coordinates,
        },
      };
    } else if (feature.geometry.type === GeometryTypeNames.LineString) {
      const coordinates = await getPositionsWithElevation(feature.geometry);

      return {
        ...feature,
        geometry: {
          ...feature.geometry,
          coordinates,
        },
      };
    } else {
      const [coordinates] = await getPositionsWithElevation(feature.geometry);

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
