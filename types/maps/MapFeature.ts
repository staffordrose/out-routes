import type { Feature, Position } from 'geojson';

import { GeometryTypeNames } from '@/data/routes';
import { MapLayer } from './MapLayer';

export type MapFeature = {
  id: string;
  type: Feature['type'];
  geometry:
    | {
        type: GeometryTypeNames.Point;
        coordinates: Position;
      }
    | {
        type: GeometryTypeNames.LineString;
        coordinates: Position[];
      }
    | {
        type: GeometryTypeNames.Polygon;
        coordinates: Position[][];
      };
  properties: {
    layer: MapLayer['id'];
    layerColor?: string;
    layerSymbol?: string;
    order: number;
    title?: string;
    color?: string;
    symbol?: string;
    description?: string;
    distance?: number;
    area?: number;
  };
};
