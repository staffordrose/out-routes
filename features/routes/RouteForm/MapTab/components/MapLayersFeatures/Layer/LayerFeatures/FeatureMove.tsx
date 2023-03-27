import { FC } from 'react';
import { UseFieldArrayUpdate, useFormContext, useWatch } from 'react-hook-form';

import { Button, TruncatedText } from '@/components/atoms';
import { colorCodes, ColorNames } from '@/data/general';
import { SymbolCodes, symbolIcons } from '@/data/routes';
import { styled } from '@/styles';
import { RouteFormValues } from '../../../../../helpers';

type FeatureMoveProps = {
  update: UseFieldArrayUpdate<RouteFormValues, 'layers'>;
  layerIndex: number;
  featureOrder: number;
};

export const FeatureMove: FC<FeatureMoveProps> = ({
  update,
  layerIndex,
  featureOrder,
}) => {
  const { control } = useFormContext<RouteFormValues>();

  const layers = useWatch({
    control,
    name: 'layers',
  });

  const layer = layers[layerIndex];
  const feature = layer.features?.[featureOrder];

  return (
    <StyledFeatureMove>
      {Array.isArray(layers) &&
        layers.length > 0 &&
        layers.map((nextLayer, nextLayerIndex) => {
          /**
           * hide current layer, but keep it in map method
           * so that nextLayerIndex is correct
           */
          if (layerIndex === nextLayerIndex) {
            return null;
          }

          const SymbolIcon =
            symbolIcons[
              (nextLayer.symbol || SymbolCodes.Marker) as SymbolCodes
            ];

          return (
            <Button
              key={nextLayer.databaseId}
              size='md'
              onClick={() => {
                if (
                  !Array.isArray(layer.features) ||
                  !layer.features.length ||
                  !feature
                ) {
                  return null;
                }

                // remove feature from current layer
                update(layerIndex, {
                  ...layer,
                  features: [
                    ...(layer.features || []).slice(0, featureOrder),
                    ...(layer.features || []).slice(featureOrder + 1),
                  ],
                });

                // add feature to new layer
                update(nextLayerIndex, {
                  ...nextLayer,
                  features: [...(nextLayer.features || []), feature],
                });
              }}
            >
              <SymbolIcon
                style={{
                  fill: nextLayer.color
                    ? colorCodes[nextLayer.color as ColorNames]
                    : undefined,
                }}
              />
              <TruncatedText as='span'>
                {nextLayer.title || '[Untitled section]'}
              </TruncatedText>
            </Button>
          );
        })}
    </StyledFeatureMove>
  );
};

const StyledFeatureMove = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$2',
  width: '$full',
});
