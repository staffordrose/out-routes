import truncate from '@turf/truncate';
import * as turf from '@turf/helpers';

import { GeometryTypeNames } from '@/data/routes';
import { MapFeature } from '@/types/maps';

export const truncateGeometryCoordinates = (
  feature: MapFeature
): MapFeature => {
  if (
    [
      GeometryTypeNames.Polygon,
      GeometryTypeNames.LineString,
      GeometryTypeNames.Point,
    ].includes(feature.geometry.type as GeometryTypeNames)
  ) {
    const acceptedFeature = feature as MapFeature;

    let turfFeature;

    if (acceptedFeature.geometry.type === GeometryTypeNames.Polygon) {
      turfFeature = turf.polygon(acceptedFeature.geometry.coordinates);
    } else if (acceptedFeature.geometry.type === GeometryTypeNames.LineString) {
      turfFeature = turf.lineString(acceptedFeature.geometry.coordinates);
    } else {
      turfFeature = turf.point(acceptedFeature.geometry.coordinates);
    }

    const truncated = truncate(turfFeature, { precision: 6 });

    return {
      ...feature,
      geometry: {
        ...feature.geometry,
        coordinates: truncated.geometry.coordinates,
      } as MapFeature['geometry'],
    };
  } else {
    return feature;
  }
};
