import { FC, MutableRefObject } from 'react';
import type { Map } from 'mapbox-gl';
import { BiShapePolygon, BiShareAlt } from 'react-icons/bi';

import { Button } from '@/components/atoms';
import { Feedback } from '@/components/layout';
import {
  GeometryTypeNames,
  GeometryTypes,
  SymbolCodes,
  symbolIcons,
} from '@/data/routes';
import { styled } from '@/styles';
import { LngLat, PopupState } from '@/types/maps';
import { RouteFeature, RouteLayer } from '@/types/routes';
import {
  getMapFeatureCenter,
  getMapBoundsFromCoordinates,
  mapFeatureRecordToMapboxFeature,
} from '@/utils';

type LayerFeaturesProps = {
  map: MutableRefObject<Map | undefined>;
  layer: RouteLayer;
  features: RouteFeature[];
  openPopup: (popupState: PopupState) => void;
};

export const LayerFeatures: FC<LayerFeaturesProps> = ({
  map,
  layer,
  features,
  openPopup,
}) => {
  const { color, symbol } = layer;

  if (!Array.isArray(features) || !features.length) {
    return (
      <Feedback
        size='xs'
        type='empty'
        icon={BiShapePolygon}
        title='No Features'
      >
        This section does not have any features.
      </Feedback>
    );
  }

  return (
    <StyledLayerFeatures>
      {features.map((feature) => {
        const mapFeature = mapFeatureRecordToMapboxFeature(layer, feature);

        return (
          <FeatureButton
            key={feature.id}
            layer={{
              color,
              symbol,
            }}
            feature={feature}
            onClick={() => {
              const center = getMapFeatureCenter(mapFeature);

              openPopup({
                center,
                feature: mapFeature,
              });

              if (
                mapFeature.geometry.type === GeometryTypeNames.Polygon ||
                mapFeature.geometry.type === GeometryTypeNames.LineString
              ) {
                const mapBounds = getMapBoundsFromCoordinates(
                  (mapFeature.geometry.type === GeometryTypeNames.Polygon
                    ? mapFeature.geometry.coordinates[0]
                    : mapFeature.geometry.coordinates) as LngLat[]
                );

                if (mapBounds) {
                  map.current?.fitBounds(mapBounds, {
                    padding: 48,
                  });
                }
              } else {
                // fly to point
                map.current?.flyTo({ center, zoom: 14 });
              }
            }}
          />
        );
      })}
    </StyledLayerFeatures>
  );
};

type FeatureButtonProps = {
  layer: Pick<RouteLayer, 'color' | 'symbol'>;
  feature: RouteFeature;
  onClick: () => void;
};

const FeatureButton: FC<FeatureButtonProps> = ({
  layer,
  feature: { type, title, color, symbol },
  onClick,
}) => {
  const SymbolIcon =
    type === GeometryTypes.LineString
      ? BiShareAlt
      : type === GeometryTypes.Polygon
      ? BiShapePolygon
      : symbolIcons[
          (symbol || layer.symbol || SymbolCodes.Marker) as SymbolCodes
        ];

  return (
    <Button variant='ghost' size='xs' onClick={onClick}>
      <SymbolIcon
        style={{
          fill: color || layer.color || undefined,
        }}
      />
      <span>{title || '[Untitled feature]'}</span>
    </Button>
  );
};

const StyledLayerFeatures = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax($56, 1fr))',
  width: '$full',
  padding: '$2',
  '& > button': {
    justifyContent: 'flex-start',
    width: '$full',
  },
  '@md': {
    gridTemplateColumns: '1fr',
  },
});
