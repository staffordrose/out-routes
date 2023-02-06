import { FC } from 'react';
import { Position } from 'geojson';
import { BiShapePolygon, BiShareAlt } from 'react-icons/bi';

import { Box, Flex, Heading, Text } from '@/components/atoms';
import { GeometryTypeNames, SymbolCodes, symbolIcons } from '@/data/routes';
import { MapFeature } from '@/types';
import { trimFeatureSymbolCode } from '@/utils';
import { Area, Distance, Elevation } from '../../CommitItemsList';

type PopupProps = {
  feature: MapFeature;
};

export const Popup: FC<PopupProps> = ({ feature }) => {
  const { type, coordinates } = feature.geometry;
  const {
    layerColor,
    layerSymbol,
    title,
    color,
    symbol,
    ele_start,
    ele_end,
    distance,
    area,
    description,
  } = feature.properties;

  const renderResult = () => {
    if (type === GeometryTypeNames.Point) {
      return (
        <>
          <Lat coordinates={coordinates} />
          <Lng coordinates={coordinates} />
          <EleStartItem combined ele={ele_start} />
          <Description description={description} />
        </>
      );
    } else if (type === GeometryTypeNames.LineString) {
      return (
        <>
          <EleStartItem ele={ele_start} />
          <EleEndItem ele={ele_end} />
          <DistanceItem distance={distance} />
          <Description description={description} />
        </>
      );
    } else {
      return (
        <>
          <AreaItem area={area} />
          <Description description={description} />
        </>
      );
    }
  };

  const SymbolIcon =
    type === GeometryTypeNames.LineString
      ? BiShareAlt
      : type === GeometryTypeNames.Polygon
      ? BiShapePolygon
      : symbolIcons[
          (trimFeatureSymbolCode(symbol) ||
            trimFeatureSymbolCode(layerSymbol) ||
            SymbolCodes.Marker) as SymbolCodes
        ];

  return (
    <>
      <Flex
        gap='sm'
        justifyContent='space-between'
        alignItems='center'
        width='full'
        marginBottom='sm'
      >
        <Flex gap='xs' placeItems='center'>
          <Box
            css={{
              '& > svg': {
                width: '$6',
                height: '$6',
              },
            }}
          >
            <SymbolIcon
              style={{
                fill: color || layerColor || undefined,
              }}
            />
          </Box>
          <Heading as='h3'>{title || '[Untitled feature]'}</Heading>
        </Flex>
      </Flex>
      {renderResult()}
    </>
  );
};

const Lat: FC<{ coordinates: Position }> = ({ coordinates }) => {
  return (
    <>
      <Text fontWeight='medium'>Latitude</Text>
      <span>{coordinates[1]}</span>
    </>
  );
};

const Lng: FC<{ coordinates: Position }> = ({ coordinates }) => {
  return (
    <>
      <Text fontWeight='medium'>Longitude</Text>
      <span>{coordinates[0]}</span>
    </>
  );
};

const EleStartItem: FC<{ combined?: boolean; ele?: number | null }> = ({
  combined,
  ...props
}) => {
  return (
    <>
      <Text fontWeight='medium'>{!combined ? `Start ` : ``}Elevation</Text>
      <Elevation {...props} />
    </>
  );
};

const EleEndItem: typeof Elevation = (props) => {
  return (
    <>
      <Text fontWeight='medium'>End Elevation</Text>
      <Elevation {...props} />
    </>
  );
};

const DistanceItem: typeof Distance = (props) => {
  return (
    <>
      <Text fontWeight='medium'>Distance</Text>
      <Distance {...props} />
    </>
  );
};

const AreaItem: typeof Area = (props) => {
  return (
    <>
      <Text fontWeight='medium'>Area</Text>
      <Area {...props} />
    </>
  );
};

const Description: FC<{ description?: string }> = ({ description }) => {
  return (
    <>
      <Text fontWeight='medium'>Description</Text>
      <span>{description || '[No description]'}</span>
    </>
  );
};
