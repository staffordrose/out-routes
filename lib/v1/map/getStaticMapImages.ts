import fs from 'fs';
import sharp from 'sharp';
import polyline from '@mapbox/polyline';
import simplify from '@turf/simplify';
import { Position } from 'geojson';
import queryString from 'query-string';
import { nanoid } from 'nanoid';
import flatten from 'lodash.flatten';

import { GeometryTypeNames } from '@/data/routes';
import { LngLat, MapFeature } from '@/types/maps';
import { StaticImage, StaticImageNames } from '@/types/routes';
import { StatusError } from '@/utils';

type BaseStaticImageName = Exclude<
  StaticImageNames,
  StaticImageNames.THUMB_240 | StaticImageNames.THUMB_120
>;

type AdditionalStaticImageName = Exclude<
  StaticImageNames,
  | StaticImageNames.OG
  | StaticImageNames.CARD_BANNER
  | StaticImageNames.THUMB_360
>;

type FeaturePart = {
  type: GeometryTypeNames;
  color: string;
  symbol?: string;
  content: string;
};

const TMP_DIR = '/tmp';

const mapboxGlAccessToken = process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN;
const mapboxStaticMapStyle = process.env.NEXT_PUBLIC_MAPBOX_STATIC_MAP_STYLE;

const BASE_URL = 'https://api.mapbox.com';
const STATIC_MAP_STYLE = `styles/v1/${mapboxStaticMapStyle}`;
const OPTIONS = queryString.stringify({
  access_token: mapboxGlAccessToken,
  padding: 48,
});

const BASE_IMAGE_SIZES: Array<{
  name: BaseStaticImageName;
  width: number;
  height: number;
}> = [
  { name: StaticImageNames.OG, width: 1200, height: 630 },
  { name: StaticImageNames.CARD_BANNER, width: 320, height: 180 },
  { name: StaticImageNames.THUMB_360, width: 360, height: 360 },
];

const ADDITIONAL_IMAGE_SIZES: Array<{
  name: AdditionalStaticImageName;
  width: number;
  height: number;
}> = [
  { name: StaticImageNames.THUMB_240, width: 240, height: 240 },
  { name: StaticImageNames.THUMB_120, width: 120, height: 120 },
];

const geometryNameSort = [
  GeometryTypeNames.Polygon,
  GeometryTypeNames.LineString,
  GeometryTypeNames.Point,
];

export const getStaticMapImages = async (
  boundingBox: [LngLat, LngLat],
  features: MapFeature[]
): Promise<StaticImage[]> => {
  try {
    /**
     * polygon and linestring feature coordinates are simplified
     * to reduce Static Image API URL length
     */
    const featureParts: FeaturePart[] = getFeatureParts(
      features
        .slice()
        .sort(
          (a, b) =>
            geometryNameSort.indexOf(a.geometry.type) -
            geometryNameSort.indexOf(b.geometry.type)
        )
    );

    // large markers and thick lines for large map images
    const largePinsAndPaths = getPinsAndPaths(featureParts, {
      markerSize: 'l',
      lineStroke: 6,
      fillOpacity: 0.25,
    });

    // small markers and thin lines for small map images
    const smallPinsAndPaths = getPinsAndPaths(featureParts, {
      markerSize: 's',
      lineStroke: 4,
      fillOpacity: 0.25,
    });

    const flatBounds = flatten(boundingBox) as [number, number, number, number];
    const boundsStr = JSON.stringify(flatBounds);

    const promiseArray = BASE_IMAGE_SIZES.map(
      async ({ name, width, height }) => {
        const pinsAndPaths =
          width >= 800 ? largePinsAndPaths : smallPinsAndPaths;

        const url = `${BASE_URL}/${STATIC_MAP_STYLE}/static/${pinsAndPaths.join(
          ','
        )}/${boundsStr}/${width}x${height}?${OPTIONS}`;

        const res = await fetch(url);

        if (!res.ok) {
          const { message } = await res.json();

          throw new StatusError(
            res.status,
            message ||
              `Something went wrong attempting to get the route ${width}x${height} static image`
          );
        }

        const fileName = `${nanoid()}.png`;
        const filePath = `${TMP_DIR}/${fileName}`;

        // write image to filesystem
        await writeToFile(filePath, res);

        // read file contents
        const content = fs.readFileSync(filePath);

        if (name === 'thumb_360') {
          // get thumb_240, thumb_120 from thumb_360 file
          const thumbImageBuffers = await getSmallThumbs(filePath);

          // remove thumb_360 image from filesystem
          fs.unlink(filePath, (error) => {
            if (error instanceof Error) {
              throw new StatusError(400, error.message);
            }
          });

          // return an array of `thumb_*` image buffers
          return [{ name, width, height, content }, ...thumbImageBuffers];
        } else {
          // remove image from filesystem
          fs.unlink(filePath, (error) => {
            if (error instanceof Error) {
              throw new StatusError(400, error.message);
            }
          });

          return { name, width, height, content };
        }
      }
    );

    const result: (StaticImage | StaticImage[])[] = await Promise.all(
      promiseArray
    );

    const imageBuffers: StaticImage[] = flatten(result);

    return imageBuffers;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new StatusError(
        400,
        `Something went wrong attempting to get the route static images`
      );
    }
  }
};

const writeToFile = async (filePath: string, res: Response): Promise<void> => {
  const data = await res.arrayBuffer();
  const buffer = Buffer.from(data);

  return new Promise((resolve, reject) => {
    const stream = fs.createWriteStream(filePath, { flags: 'a' });
    stream.write(buffer, (err) => {
      if (err) {
        reject(err);
        return;
      }
      stream.end(() => {
        resolve();
      });
    });
  });
};

const getSmallThumbs = async (filePath: string): Promise<StaticImage[]> => {
  const promiseArray = ADDITIONAL_IMAGE_SIZES.map(
    async ({ name, width, height }) => {
      const buffer = await sharp(filePath).resize(width).toBuffer();

      return {
        name,
        width,
        height,
        content: buffer,
      };
    }
  );

  return await Promise.all(promiseArray);
};

const getFeatureParts = (
  features: MapFeature[]
): {
  type: GeometryTypeNames;
  color: string;
  symbol?: string;
  content: string;
}[] => {
  return features.map((feature) => {
    const color = feature.properties.color
      ? feature.properties.color.slice(1)
      : feature.properties.layerColor
      ? feature.properties.layerColor.slice(1)
      : '000';

    if (
      [GeometryTypeNames.Polygon, GeometryTypeNames.LineString].includes(
        feature.geometry.type
      )
    ) {
      const simplified = simplifyGeometry(feature);

      if (simplified.geometry.type === GeometryTypeNames.Polygon) {
        return {
          type: GeometryTypeNames.Polygon,
          color,
          content: encodePolyline(simplified.geometry.coordinates[0]),
        };
      } else if (simplified.geometry.type === GeometryTypeNames.LineString) {
        return {
          type: GeometryTypeNames.LineString,
          color,
          content: encodePolyline(simplified.geometry.coordinates),
        };
      } else {
        return {
          type: GeometryTypeNames.Point,
          color,
          content: '',
        };
      }
    } else {
      const { geometry, properties } = feature;
      const { coordinates } = geometry;
      const { symbol, layerSymbol } = properties;

      return {
        type: GeometryTypeNames.Point,
        color,
        symbol:
          symbol && symbol !== 'marker'
            ? symbol
            : layerSymbol && layerSymbol !== 'marker'
            ? layerSymbol
            : '',
        content: `${coordinates[0]},${coordinates[1]}`,
      };
    }
  });
};

const simplifyGeometry = (feature: MapFeature): MapFeature => {
  const coordinates: Position[] =
    feature.geometry.type === GeometryTypeNames.Polygon
      ? feature.geometry.coordinates[0]
      : feature.geometry.type === GeometryTypeNames.LineString
      ? feature.geometry.coordinates
      : [];

  const count = coordinates.length;

  // decimal representation of the percent of coordinates pairs to keep
  let desiredRatio = 1;

  // the higher the coordinates count, the fewer should be kept
  if (count > 2000) {
    desiredRatio = 0.0625;
  } else if (count > 1500) {
    desiredRatio = 0.075;
  } else if (count > 1000) {
    desiredRatio = 0.1;
  } else if (count > 500) {
    desiredRatio = 0.15;
  } else if (count > 250) {
    desiredRatio = 0.25;
  } else if (count > 125) {
    desiredRatio = 0.5;
  } else if (count > 100) {
    desiredRatio = 0.625;
  } else if (count > 50) {
    desiredRatio = 0.75;
  } else if (count > 25) {
    desiredRatio = 0.875;
  } else if (count > 10) {
    desiredRatio = 0.925;
  }

  let simplifiedFeature = Object.assign({}, feature);

  let simplifiedCount = count;

  let attempts = 1;

  while (simplifiedCount / count > desiredRatio) {
    // further reduce number of points in geometry for every attempt
    simplifiedFeature = simplify(feature, {
      tolerance: 0.00015 * attempts,
      highQuality: false,
      mutate: true,
    });

    simplifiedCount =
      simplifiedFeature.geometry.type === GeometryTypeNames.Polygon
        ? simplifiedFeature.geometry.coordinates[0].length
        : simplifiedFeature.geometry.type === GeometryTypeNames.LineString
        ? simplifiedFeature.geometry.coordinates.length
        : 0;

    attempts++;
  }

  return simplifiedFeature;
};

const encodePolyline = (geojsonCoordinates: Position[]): string => {
  // map [lng, lat] to [lat, lng]
  const coordinates: [number, number][] = geojsonCoordinates.map(
    ([lng, lat]) => [lat, lng]
  );

  const p = polyline.encode(coordinates);

  return encodeURIComponent(p);
};

const getPinsAndPaths = (
  featureParts: FeaturePart[],
  {
    markerSize,
    lineStroke,
    fillOpacity,
  }: {
    markerSize: 's' | 'l';
    lineStroke: number;
    fillOpacity: number;
  }
): string[] => {
  return featureParts.map(({ type, color, symbol, content }) => {
    if (type === GeometryTypeNames.Polygon) {
      return `path-${lineStroke}+${color}+${color}-${fillOpacity}(${content})`;
    } else if (type === GeometryTypeNames.LineString) {
      return `path-${lineStroke}+${color}(${content})`;
    } else {
      return `pin-${markerSize}${
        symbol ? `-${symbol}` : ``
      }+${color}(${content})`;
    }
  });
};
