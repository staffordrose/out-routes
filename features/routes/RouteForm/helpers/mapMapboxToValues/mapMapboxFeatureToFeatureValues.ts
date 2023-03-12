import { Position } from 'geojson';
import flatten from 'lodash.flatten';

import { GeometryTypeNames, geometryTypes, GeometryTypes } from '@/data/routes';
import { MapFeature } from '@/types/maps';
import { FeatureValues } from '../types';

export const mapMapboxFeatureToFeatureValues = (
  feature: MapFeature
): FeatureValues => {
  const { geometry } = feature;

  const type = geometry.type
    ? geometryTypes[geometry.type as GeometryTypeNames]
    : GeometryTypes.Point;

  const coordinates =
    type === GeometryTypes.Polygon
      ? (flatten(geometry.coordinates as Position[][]) as Position[])
      : type === GeometryTypes.LineString
      ? (geometry.coordinates as Position[])
      : ([geometry.coordinates] as Position[]);

  return {
    files: [],
    databaseId: feature.id,
    type,
    /**
     * coordinates are stored as [lng, lat, ele?] in db
     * to be compatible with mapbox
     */
    coordinates:
      Array.isArray(coordinates) && coordinates.length
        ? coordinates.map(([lng, lat, ele]: Position) => ({
            lat: lat.toString() || '',
            lng: lng.toString() || '',
            ele: ele?.toString() || '',
          }))
        : [{ lat: '', lng: '', ele: '' }],
    title: feature.properties.title || '',
    // color select field requires undefined to show placeholder
    color: feature.properties.color || undefined,
    // symbol select field requires undefined to show placeholder
    symbol: feature.properties.symbol || undefined,
    description: feature.properties.description || '',
    distance: Number(feature.properties.distance) || 0,
    area: Number(feature.properties.area) || 0,
    image_id: null,
    image_full: null,
    image_large: null,
    image_card_banner: null,
    image_thumb_360: null,
    image_thumb_240: null,
    image_thumb_120: null,
  };
};
