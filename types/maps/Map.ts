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
