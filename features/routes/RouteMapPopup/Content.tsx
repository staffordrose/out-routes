import { FC, useMemo } from 'react';
import { Position } from 'geojson';
import {
  BiArea,
  BiDownArrowAlt,
  BiRuler,
  BiTrip,
  BiUpArrowAlt,
} from 'react-icons/bi';

import { Flex, Grid, Heading, Icon } from '@/components/atoms';
import { GeometryTypeNames } from '@/data/routes';
import { styled } from '@/styles';
import { MapFeature } from '@/types/maps';
import { round } from '@/utils';
import { Area, Distance, Elevation } from '../CommitItemsList';

export type ContentProps = {
  feature: MapFeature;
};

export const Content: FC<ContentProps> = ({ feature }) => {
  const { geometry } = feature;

  const renderResult = () => {
    if (geometry.type === GeometryTypeNames.Polygon) {
      return <Polygon feature={feature} />;
    } else if (geometry.type === GeometryTypeNames.LineString) {
      return <LineString feature={feature} />;
    } else {
      return <Point feature={feature} />;
    }
  };

  return <StyledContent>{renderResult()}</StyledContent>;
};

const StyledContent = styled('div', {
  padding: '$2',
});

const Point: FC<{ feature: MapFeature }> = ({ feature }) => {
  const {
    geometry: { coordinates },
    properties: { description },
  } = feature;

  const lng = coordinates[0];
  const lat = coordinates[1];
  const ele = coordinates[2];

  return (
    <>
      <Heading as='h6'>Coordinates</Heading>
      <span>
        {lat}, {lng}
      </span>
      <Heading as='h6'>Elevation</Heading>
      {typeof ele === 'number' ? (
        <Flex gap='xs' alignItems='flex-start'>
          <Icon as={BiRuler} size='xs' />
          {typeof ele === 'number' ? (
            <Elevation ele={ele} />
          ) : (
            <PlaceholderText>[Unknown]</PlaceholderText>
          )}
        </Flex>
      ) : (
        <PlaceholderText>[No elevation]</PlaceholderText>
      )}
      <Description description={description} />
    </>
  );
};

const LineString: FC<{ feature: MapFeature }> = ({ feature }) => {
  const {
    geometry: { coordinates },
    properties: { description, distance },
  } = feature;

  const elevations = useMemo(
    () =>
      (coordinates as Position[])
        .filter((position) => typeof position[2] === 'number')
        .map((position) => position[2]),
    [coordinates]
  );

  const { gain, loss } = useMemo(
    () =>
      elevations.reduce(
        (accum, curr: number, index) => {
          if (index === 0) return accum;

          const prev: number = elevations[index - 1];

          accum.gain += curr > prev ? round(curr - prev, 3) : 0;

          accum.loss += curr < prev ? round(prev - curr, 3) : 0;

          return accum;
        },
        { gain: 0, loss: 0 }
      ),
    [elevations]
  );

  const start = (coordinates as Position[])[0][2];
  const end = (coordinates as Position[])[coordinates.length - 1][2];

  return (
    <>
      <Heading as='h6'>Elevation Start/End</Heading>
      <Grid
        gap='sm'
        justifyContent='start'
        alignItems='center'
        css={{ gridTemplateColumns: 'repeat(2, 1fr)' }}
      >
        <Flex gap='xs' alignItems='flex-start'>
          <Icon as={BiRuler} size='xs' />
          {typeof start === 'number' ? (
            <Elevation ele={start} />
          ) : (
            <PlaceholderText>[Unknown]</PlaceholderText>
          )}
        </Flex>
        <Flex gap='xs' alignItems='flex-start'>
          <Icon as={BiRuler} size='xs' />
          {typeof end === 'number' ? (
            <Elevation ele={end} />
          ) : (
            <PlaceholderText>[Unknown]</PlaceholderText>
          )}
        </Flex>
      </Grid>
      <Heading as='h6'>Elevation Gain/Loss</Heading>
      <Grid
        gap='sm'
        justifyContent='start'
        alignItems='center'
        css={{ gridTemplateColumns: 'repeat(2, 1fr)' }}
      >
        <Flex gap='xs' alignItems='flex-start'>
          <Icon as={BiUpArrowAlt} size='xs' />
          {typeof gain === 'number' ? (
            <Elevation ele={gain} />
          ) : (
            <PlaceholderText>[Unknown]</PlaceholderText>
          )}
        </Flex>
        <Flex gap='xs' alignItems='flex-start'>
          <Icon as={BiDownArrowAlt} size='xs' />
          {typeof loss === 'number' ? (
            <Elevation ele={loss} />
          ) : (
            <PlaceholderText>[Unknown]</PlaceholderText>
          )}
        </Flex>
      </Grid>
      <Heading as='h6'>Distance</Heading>
      <Flex gap='xs' alignItems='flex-start'>
        <Icon as={BiTrip} size='xs' />
        <Distance distance={distance} />
      </Flex>
      <Description description={description} />
    </>
  );
};

const Polygon: FC<{ feature: MapFeature }> = ({ feature }) => {
  const {
    properties: { area, description },
  } = feature;

  return (
    <>
      <Heading as='h6'>Area</Heading>
      <Flex gap='xs' alignItems='flex-start'>
        <Icon as={BiArea} size='xs' />
        <Area area={area} />
      </Flex>
      <Description description={description} />
    </>
  );
};

const Description: FC<{ description?: string }> = ({ description }) => {
  return (
    <>
      <Heading as='h6'>Description</Heading>
      {description ? (
        <span>{description}</span>
      ) : (
        <PlaceholderText>[No description]</PlaceholderText>
      )}
    </>
  );
};

const PlaceholderText = styled('span', {
  color: '$slate-500',
});
