import { FC, useMemo } from 'react';
import flatten from 'lodash.flatten';

import { GeometryTypes } from '@/data/routes';
import { Position } from 'geojson';

const MAX_ROWS = 3;

type CoordinatesProps = {
  type?: string | null;
  coordinates?: string | null;
};

export const Coordinates: FC<CoordinatesProps> = ({
  type,
  coordinates: coordinatesJson,
}) => {
  let coordinates = useMemo(
    () => JSON.parse(coordinatesJson || ''),
    [coordinatesJson]
  );

  if (!type || !Array.isArray(coordinates)) return null;

  if (type === GeometryTypes.Polygon || type === GeometryTypes.LineString) {
    coordinates =
      type === GeometryTypes.Polygon ? flatten(coordinates) : coordinates;

    return (
      <div>
        {(coordinates as Position[]).slice(0, MAX_ROWS).map((c, index) => {
          return <Position key={index} lat={c[0]} lng={c[1]} />;
        })}
        {coordinates.length > MAX_ROWS && (
          <p>
            ...{coordinates.length - MAX_ROWS} more row
            {coordinates.length - MAX_ROWS === 1 ? `` : `s`}
          </p>
        )}
      </div>
    );
  } else {
    return <Position lat={coordinates[0]} lng={coordinates[1]} />;
  }
};

type PositionProps = {
  lat: number;
  lng: number;
};

const Position: FC<PositionProps> = ({ lat, lng }) => {
  return (
    <p>
      {lat}, {lng}
    </p>
  );
};
