import fs from 'fs';
import util from 'util';
import tileCover from '@mapbox/tile-cover';
import tilebelt from '@mapbox/tilebelt';
import { Position } from 'geojson';
import getPixels from 'get-pixels';
import queryString from 'query-string';
import { nanoid } from 'nanoid';

import { MapFeature } from '@/types/maps';
import { roundToDecimalCount, StatusError } from '@/utils';
import { GeometryTypeNames } from '@/data/routes';

const mapboxGlAccessToken = process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN;

const BASE_URL = 'https://api.mapbox.com/v4';
const TILESET_ID = 'mapbox.terrain-rgb';
const FORMAT = 'pngraw';
const OPTIONS = queryString.stringify({
  access_token: mapboxGlAccessToken,
});

type Tile = {
  x: number;
  y: number;
  zoom: number;
  pixels: Pixels;
};

type Pixels = {
  data: Uint8Array;
  shape: number[];
  stride: number[];
  offset: number;
};

export const getFeatureElevations = async (
  geometry: MapFeature['geometry']
): Promise<number[]> => {
  try {
    const tilesToFetch = tileCover.tiles(geometry, {
      min_zoom: 4,
      max_zoom: 14,
    });

    const tilesPromiseArray = tilesToFetch.map(async ([x, y, zoom]) => {
      try {
        const fileId = nanoid();
        const fileName = `${fileId}.png`;

        const res = await fetch(
          `${BASE_URL}/${TILESET_ID}/${zoom}/${x}/${y}.${FORMAT}?${OPTIONS}`
        );

        if (!res.ok) {
          throw new StatusError(
            res.status,
            `Something went wrong attempting to get the feature elevations`
          );
        }

        // write terrain image to filesystem
        await writeToFile(fileName, res);

        const pixels = await getImagePixels(fileName);

        // remove terrain image from filesystem
        fs.unlink(fileName, (error) => {
          if (error instanceof Error) {
            throw new StatusError(400, error.message);
          }
        });

        return {
          x,
          y,
          zoom,
          pixels,
        };
      } catch (error) {
        if (error instanceof Error) {
          throw new StatusError(400, error.message);
        }
      }
    });

    const tiles: (Tile | undefined)[] = await Promise.all(
      tilesPromiseArray.map((promise) => promise.then((result) => result))
    );

    // used to determine which point belongs to which tile
    const allZooms: number[] = tiles
      .filter((zooms, index, array) => array.indexOf(zooms) === index)
      .map((tile) => tile?.zoom as number);

    const points: Position[] =
      geometry.type === GeometryTypeNames.Polygon
        ? geometry.coordinates[0]
        : geometry.type === GeometryTypeNames.LineString
        ? geometry.coordinates
        : [geometry.coordinates];

    const elevations: number[] = points.map(([lng, lat]) => {
      const zoom = allZooms.find((zoom) => {
        const [x, y] = tilebelt.pointToTile(lng, lat, zoom);
        return (
          typeof x === 'number' &&
          !Number.isNaN(x) &&
          typeof y === 'number' &&
          !Number.isNaN(y)
        );
      });

      if (typeof zoom !== 'number' || Number.isNaN(zoom)) {
        return 0;
      }

      const [tileX, tileY] = tilebelt.pointToTile(lng, lat, zoom);

      const tile = tiles.find(
        (tile) => tile && tile.x === tileX && tile.y === tileY
      );

      if (!tile) {
        return 0;
      }

      const ele = getPointEle(tile, [lng, lat]);

      if (typeof ele !== 'number' || Number.isNaN(ele)) {
        return 0;
      }

      return roundToDecimalCount(ele, {
        decimalCount: 1,
      });
    });

    return elevations;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new StatusError(
        400,
        `Something went wrong attempting to get the feature elevations`
      );
    }
  }
};

const writeToFile = async (filename: string, res: Response): Promise<void> => {
  const data = await res.arrayBuffer();
  const buffer = Buffer.from(data);

  return new Promise((resolve, reject) => {
    const stream = fs.createWriteStream(filename, { flags: 'a' });
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

const getPixelsAsync: (
  arg1: string,
  arg2: string,
  arg3?: (err: Error | null, pixels: Pixels) => void
) => Promise<Pixels> = util.promisify(getPixels);

const getImagePixels = async (filePath: string): Promise<Pixels> => {
  return new Promise<Pixels>((resolve, reject) => {
    getPixelsAsync(filePath, '', (err: Error | null, pixels: Pixels) => {
      if (err) {
        reject(err);
      } else {
        resolve(pixels);
      }
    });
  });
};

const getPointEle = (tile: Tile, position: Position) => {
  const { pixels } = tile;

  const pt = getPixelCoords(tile, position);

  const width = pixels.shape[1];
  const channels = pixels.shape[2];
  const idx = (pt.y * width + pt.x) * channels;

  const r = pixels.data[idx];
  const g = pixels.data[idx + 1];
  const b = pixels.data[idx + 2];
  const ele = -10000 + (r * 256 * 256 + g * 256 + b) * 0.1;

  return ele;
};

const getPixelCoords = (
  tile: Tile,
  [lng, lat]: Position
): { x: number; y: number } => {
  const tileSize = 256;
  const scale = Math.pow(2, tile.zoom);
  const latRad = (lat * Math.PI) / 180;

  const xTile = Math.floor(((lng + 180) / 360) * scale);
  const yTile = Math.floor(
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) *
      scale
  );

  const xPixel = Math.floor((((lng + 180) / 360) * scale - xTile) * tileSize);
  const yPixel = Math.floor(
    (((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) *
      scale -
      yTile) *
      tileSize
  );

  return {
    x: xPixel,
    y: yPixel,
  };
};
