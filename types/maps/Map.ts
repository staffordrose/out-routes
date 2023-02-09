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

export type BoundingBox = {
  _ne: { lng: number; lat: number };
  _sw: { lng: number; lat: number };
};
