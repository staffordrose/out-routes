import { LngLat } from './Map';

export type GPXEmail = {
  id: string;
  domain: string;
};

export type GPXLink = {
  href: string;
  text: string;
  type: string | null;
};

export type GPXAuthor = {
  name: string;
  email: GPXEmail | null;
  link: GPXLink | null;
};

export type GPXCopyright = {
  author: string;
  year: number | null;
  license: string | null;
};

export type GPXMetadata = {
  name: string | null;
  desc: string | null;
  author: GPXAuthor | null;
  copyright: GPXCopyright | null;
  link: GPXLink | null;
  time: Date | null;
  keywords: string[] | null;
  bounds: LngLat[] | null;
};

export type GPXOptions = {
  fileName: string;
};

export type GPXPoint = {
  lat: number;
  lon: number;
  ele: number | null;
  time: Date | null;
};

export type GPXWaypoint = GPXPoint & {
  section: string | null;
  name: string | null;
  displayColor: string | null;
  sym: string | null;
  cmt: string | null;
  desc: string | null;
};

export type GPXDistance = {
  total: number | null;
  cumul: (number | null)[];
};

export type GPXElevation = {
  max: number | null;
  min: number | null;
  pos: number | null;
  neg: number | null;
  avg: number | null;
};

export type GPXRoute = {
  section: string | null;
  name: string | null;
  displayColor: string | null;
  cmt: string | null;
  desc: string | null;
  src: string | null;
  number: string | null;
  type: string | null;
  link: GPXLink | null;
  distance: GPXDistance;
  elevation: GPXElevation;
  slopes: number[];
  points: GPXPoint[];
  transportationMode: string | null;
};

export type GPXTrack = GPXRoute;

export enum GPXFeatures {
  RTE = 'rte',
  TRK = 'trk',
  WPT = 'wpt',
}

export type GPXFeature =
  | {
      type: GPXFeatures.RTE;
      feature: GPXRoute;
    }
  | {
      type: GPXFeatures.TRK;
      feature: GPXTrack;
    }
  | {
      type: GPXFeatures.WPT;
      feature: GPXWaypoint;
    };
