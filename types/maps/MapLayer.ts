import { FeatureCollection } from 'geojson';

import { MapFeature } from './MapFeature';

export type MapLayer = {
  id: string;
  order: number;
  title: string | null;
  color: string;
  symbol: string;
  data: {
    type: FeatureCollection['type'];
    features: MapFeature[];
  };
};
