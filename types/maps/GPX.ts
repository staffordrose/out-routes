import { LngLat } from './Map';

export type Email = {
  id: string;
  domain: string;
};

export type Link = {
  href: string;
  text: string;
  type: string | null;
};

export type Author = {
  name: string;
  email: Email | null;
  link: Link | null;
};

export type Copyright = {
  author: string;
  year: number | null;
  license: string | null;
};

export type GPXMetadata = {
  name: string | null;
  desc: string | null;
  author: Author | null;
  copyright: Copyright | null;
  link: Link | null;
  time: Date | null;
  keywords: string[] | null;
  bounds: LngLat[] | null;
};

export type GPXOptions = {
  fileName: string;
};

export type Point = {
  lat: number;
  lon: number;
  ele: number | null;
  time: Date | null;
};

export type Waypoint = Point & {
  name: string | null;
  sym: string | null;
  cmt: string | null;
  desc: string | null;
};

export type Distance = {
  total: number | null;
  cumul: (number | null)[];
};

export type Elevation = {
  max: number | null;
  min: number | null;
  pos: number | null;
  neg: number | null;
  avg: number | null;
};

export type Track = {
  name: string | null;
  cmt: string | null;
  desc: string | null;
  src: string | null;
  number: string | null;
  type: string | null;
  link: Link;
  distance: Distance;
  elevation: Elevation;
  slopes: number[];
  points: Point[];
};
