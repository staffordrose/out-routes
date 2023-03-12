import { LngLatLike, Map } from 'mapbox-gl';
import { Position } from 'geojson';

import { GeometryTypeNames } from '@/data/routes';
import { LngLat, MapFeature } from '@/types/maps';
import { roundToDecimalCount } from '@/utils';

export const addElevationToMapFeature = (
  mapRef: Map,
  feature: MapFeature
): MapFeature => {
  const getPositionWithElevation = (lngLat: Position | LngLat) => {
    const position = Array.from(lngLat);

    let ele = mapRef.queryTerrainElevation(lngLat as LngLatLike, {
      exaggerated: false,
    });

    if (typeof ele === 'number' && !Number.isNaN(ele)) {
      ele = roundToDecimalCount(ele, { decimalCount: 3 });
      position.push(ele);
    }

    return position;
  };

  // add elevation for all positions
  if (feature.geometry.type === GeometryTypeNames.Polygon) {
    const positions: Position[] = feature.geometry.coordinates[0].map(
      (lngLat) => getPositionWithElevation(lngLat)
    );

    const coordinates: Position[][] = [positions];

    return {
      ...feature,
      geometry: {
        ...feature.geometry,
        coordinates,
      },
    };
  } else if (feature.geometry.type === GeometryTypeNames.LineString) {
    const coordinates: Position[] = feature.geometry.coordinates.map((lngLat) =>
      getPositionWithElevation(lngLat)
    );

    return {
      ...feature,
      geometry: {
        ...feature.geometry,
        coordinates,
      },
    };
  } else if (feature.geometry.type === GeometryTypeNames.Point) {
    const lngLat = feature.geometry.coordinates;

    return {
      ...feature,
      geometry: {
        ...feature.geometry,
        coordinates: getPositionWithElevation(lngLat),
      },
    };
  } else {
    return feature;
  }
};
