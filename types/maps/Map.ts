import { Feature } from 'geojson';

import { MapFeature } from './MapFeature';

export type Controls = {
  scale: {
    unit: string;
  };
};

export type LngLat = [number, number];

export type Viewport = {
  center: LngLat;
  zoom: number;
};

export type PopupState = {
  center: LngLat;
  feature: MapFeature;
};

type GeocodingFeatures = {
  id: string;
  type: string;
  place_type: string;
  relevance: number;
  address?: string;
  properties: {
    accuracy?: string;
    address?: string;
    category?: string;
    maki?: string;
    wikidata?: string;
    short_code?: string;
  };
  text: string;
  place_name: string;
  matching_text?: string;
  matching_place_name?: string;
  language?: string;
  bbox: [number, number, number, number];
  center: LngLat;
  geometry: {
    type: Feature['geometry']['type'];
    coordinates: LngLat;
    interpolated?: boolean;
    omitted?: boolean;
  };
  context: any[];
  routable_points?: {
    points?: { coordinates: LngLat }[] | null;
  };
};

export type GeocodingResponse = {
  type: 'FeatureCollection';
  query: string[];
  features: GeocodingFeatures[];
  attribution: string;
};
