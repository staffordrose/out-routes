import { Position } from 'geojson';

import { GeometryTypes } from '@/data/routes';
import { RouteFeature } from '@/types/routes';
import { FeatureValues } from './types';

export const mapFeatureRecordToFeatureValues = (
  feature: RouteFeature
): FeatureValues => {
  let coordinates = feature.coordinates ? JSON.parse(feature.coordinates) : [];

  // format coordinates into an array of positions
  coordinates =
    Array.isArray(coordinates) && coordinates.length
      ? feature.type === GeometryTypes.Polygon
        ? coordinates[0]
        : feature.type === GeometryTypes.LineString
        ? coordinates
        : [coordinates]
      : [];

  return {
    files: [] as FeatureValues['files'],
    databaseId: feature.id,
    type: feature.type || GeometryTypes.Point,
    /**
     * coordinates are stored as [lng, lat] in db
     * to be compatible with mapbox
     */
    coordinates:
      Array.isArray(coordinates) && coordinates.length
        ? coordinates.map(([lng, lat]: Position) => ({
            lat: lat.toString() || '',
            lng: lng.toString() || '',
          }))
        : [{ lat: '', lng: '' }],
    title: feature.title || '',
    // color select field requires undefined to show placeholder
    color: feature.color || undefined,
    // symbol select field requires undefined to show placeholder
    symbol: feature.symbol || undefined,
    description: feature.description || '',
    ele_start: Number(feature.ele_start) || 0,
    ele_end: Number(feature.ele_end) || 0,
    distance: Number(feature.distance) || 0,
    area: Number(feature.area) || 0,
    image_id: feature.image_id || null,
    image_full: feature.image_full || null,
    image_large: feature.image_large || null,
    image_card_banner: feature.image_card_banner || null,
    image_thumb_360: feature.image_thumb_360 || null,
    image_thumb_240: feature.image_thumb_240 || null,
    image_thumb_120: feature.image_thumb_120 || null,
  };
};
