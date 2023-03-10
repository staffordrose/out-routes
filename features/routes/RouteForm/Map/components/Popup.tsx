import { FC } from 'react';
import { Position } from 'geojson';
import { BiEditAlt, BiShapePolygon, BiShareAlt } from 'react-icons/bi';

import { Heading, IconButton, TruncatedText } from '@/components/atoms';
import { GeometryTypeNames, SymbolCodes, symbolIcons } from '@/data/routes';
import { styled } from '@/styles';
import { MapFeature } from '@/types/maps';
import { trimFeatureSymbolCode } from '@/utils';
import { Area, Distance, Elevation } from '../../../CommitItemsList';
import { LayerValues } from '../../helpers';

type PopupProps = {
  layerIndex: number;
  layer: LayerValues;
  feature: MapFeature;
  openFeatureEditDialog: (
    layerIndex: number,
    layer: LayerValues,
    feature: MapFeature
  ) => void;
};

export const Popup: FC<PopupProps> = ({
  layerIndex,
  layer,
  feature,
  openFeatureEditDialog,
}) => {
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
          <Coordinates coordinates={coordinates} />
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
    <StyledPopup>
      <div>
        <div>
          <SymbolIcon
            style={{
              fill: color || layerColor || undefined,
            }}
          />
          <TruncatedText as='h5' lineClamp={2}>
            {title || '[Untitled feature]'}
          </TruncatedText>
        </div>
        <IconButton
          type='button'
          variant='ghost'
          size='xs'
          aria-label='Edit Feature'
          onClick={() => {
            openFeatureEditDialog(layerIndex, layer, feature);
          }}
          css={{ flexShrink: 0 }}
        >
          <BiEditAlt />
        </IconButton>
      </div>
      <div>{renderResult()}</div>
    </StyledPopup>
  );
};

const StyledPopup = styled('div', {
  '& > div:first-child': {
    position: 'sticky',
    top: 0,
    left: 0,
    display: 'flex',
    gap: '$2',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 'full',
    height: '$12',
    padding: '$2',
    borderBottomWidth: '$1',
    borderBottomStyle: 'solid',
    borderBottomColor: '$slate-300',
    backgroundColor: '$white',
    '& > div': {
      display: 'flex',
      gap: '$1',
      justifyContent: 'flex-start',
      alignItems: 'center',
      width: '$full',
      minHeight: '$7',
      paddingY: '$1',
      '& > svg': {
        flexShrink: 0,
        width: '$6',
        height: '$6',
      },
    },
  },
  '& > div:last-child': {
    overflowY: 'auto',
    height: 'calc($52 - $12)',
    padding: '$2',
  },
  '@md': {
    '& > div:last-child': {
      height: 'calc($64 - $12)',
    },
  },
});

const Coordinates: FC<{ coordinates: Position }> = ({ coordinates }) => {
  return (
    <>
      <Heading as='h6'>Coordinates</Heading>
      <span>
        {coordinates[1]}, {coordinates[0]}
      </span>
    </>
  );
};

const EleStartItem: FC<{ combined?: boolean; ele?: number | null }> = ({
  combined,
  ...props
}) => {
  return (
    <>
      <Heading as='h6'>{!combined ? `Start ` : ``}Elevation</Heading>
      {typeof props.ele === 'number' ? (
        <Elevation {...props} />
      ) : (
        <PlaceholderText>[No elevation]</PlaceholderText>
      )}
    </>
  );
};

const EleEndItem: typeof Elevation = (props) => {
  return (
    <>
      <Heading as='h6'>End Elevation</Heading>
      {typeof props.ele === 'number' ? (
        <Elevation {...props} />
      ) : (
        <PlaceholderText>[No elevation]</PlaceholderText>
      )}
    </>
  );
};

const DistanceItem: typeof Distance = (props) => {
  return (
    <>
      <Heading as='h6'>Distance</Heading>
      <Distance {...props} />
    </>
  );
};

const AreaItem: typeof Area = (props) => {
  return (
    <>
      <Heading as='h6'>Area</Heading>
      <Area {...props} />
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
