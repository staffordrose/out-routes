import { ChangeEvent, FC, MutableRefObject, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  UseFieldArrayAppend,
  UseFieldArrayUpdate,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import type { Map } from 'mapbox-gl';
import type MapboxDraw from '@mapbox/mapbox-gl-draw';
import { BiSearch } from 'react-icons/bi';

import { Feedback } from '@/components/layout';
import { Button, Input } from '@/components/atoms';
import { ColorCodes } from '@/data/general';
import {
  geocodingDataTypeIcons,
  GeocodingDataTypes,
  GeometryTypeNames,
  SymbolCodes,
} from '@/data/routes';
import { useDebounce } from '@/hooks';
import { geocodeQuery } from '@/lib/v1/api/map';
import { styled } from '@/styles';
import { MapFeature, MapLayer } from '@/types';
import { createAlphaNumericId, roundToDecimalCount } from '@/utils';
import {
  LayerValues,
  mapMapFeatureToFeatureValues,
  RouteFormValues,
} from '../../helpers';
import { addLayerFeature } from '../helpers';

type SearchProps = {
  append: UseFieldArrayAppend<RouteFormValues, 'layers'>;
  update: UseFieldArrayUpdate<RouteFormValues, 'layers'>;
  map: MutableRefObject<Map | undefined>;
  draw: MutableRefObject<MapboxDraw | undefined>;
  setActiveLayerId: (id: MapLayer['id'] | null) => void;
};

export const Search: FC<SearchProps> = ({
  append,
  update,
  map,
  draw,
  setActiveLayerId,
}) => {
  const { control } = useFormContext<RouteFormValues>();

  const layers = useWatch({ control, name: 'layers' });
  const activeLayerId = useWatch({ control, name: 'activeLayerId' });

  const [query, setQuery] = useState('');

  const debouncedQuery = useDebounce(query, 300);

  const searchQuery = useQuery({
    queryKey: ['map-search', debouncedQuery],
    queryFn: () => geocodeQuery(debouncedQuery),
    staleTime: 300_000,
    enabled: !!debouncedQuery,
  });

  const renderResult = () => {
    if (searchQuery.isLoading && searchQuery.isFetching) {
      return <Feedback size='xs' type='loading' title='Loading' />;
    }
    if (searchQuery.isError) {
      return (
        <Feedback size='xs' type='error' title='Something went wrong'>
          {searchQuery.error instanceof Error
            ? searchQuery.error.message
            : null}
        </Feedback>
      );
    }
    if (searchQuery.isSuccess) {
      const { features } = searchQuery.data;

      if (!Array.isArray(features) || !features.length) {
        return (
          <Feedback size='xs' type='empty' icon={BiSearch} title='No Places'>
            No places match your search.
          </Feedback>
        );
      }
      return (
        <Results>
          {features.map((feature) => {
            const { id, center, place_name, place_type, text } = feature;

            const Icon =
              geocodingDataTypeIcons[place_type[0] as GeocodingDataTypes];

            return (
              <Button
                key={id}
                variant='ghost'
                size='xs'
                onClick={() => {
                  const cb = ({ databaseId }: LayerValues) =>
                    databaseId === activeLayerId;
                  const layerColor =
                    (activeLayerId &&
                      layers?.some(cb) &&
                      layers.find(cb)?.color) ||
                    ColorCodes.Red;
                  const layerSymbol =
                    (activeLayerId &&
                      layers?.some(cb) &&
                      `maki-${
                        layers.find(cb)?.symbol || SymbolCodes.Marker
                      }`) ||
                    `maki-${SymbolCodes.Marker}`;

                  const f = {
                    id: createAlphaNumericId(24),
                    type: 'Feature',
                    geometry: {
                      type: GeometryTypeNames.Point,
                      coordinates: [
                        roundToDecimalCount(center[0], {
                          decimalCount: 6,
                        }),
                        roundToDecimalCount(center[1], {
                          decimalCount: 6,
                        }),
                      ],
                    },
                    properties: {
                      layerColor,
                      layerSymbol,
                      title: text,
                    },
                  } as MapFeature;

                  // add feature to map
                  draw.current?.add(f);

                  if (!activeLayerId) {
                    const newLayerId = createAlphaNumericId(24);

                    append({
                      databaseId: newLayerId,
                      title: '',
                      color: ColorCodes.Red,
                      symbol: SymbolCodes.Marker,
                      features: [mapMapFeatureToFeatureValues(f)],
                    });

                    setActiveLayerId(newLayerId);
                  } else {
                    addLayerFeature(update, layers, activeLayerId, f);
                  }

                  // fly to new feature
                  map.current?.flyTo({ center, zoom: 10 });

                  setQuery('');
                }}
              >
                <Icon />
                <span>{place_name}</span>
              </Button>
            );
          })}
        </Results>
      );
    }
  };

  return (
    <StyledSearch>
      <Input
        type='text'
        placeholder='Search'
        value={query}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setQuery(e.target.value)
        }
      />
      {renderResult()}
    </StyledSearch>
  );
};

const StyledSearch = styled('div', {
  position: 'absolute',
  zIndex: 10,
  top: '$2',
  left: '$2',
  display: 'flex',
  flexDirection: 'column',
  gap: '$2',
  width: '$full',
  maxWidth: '$112',
  '& > input': {
    width: '$full',
    maxWidth: '$64',
    backgroundColor: '$white',
  },
  '& > button': {
    flexShrink: 0,
  },
});

const Results = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '$full',
  padding: '$1',
  borderRadius: '$md',
  backgroundColor: '$white',
  boxShadow:
    '0px 15px 30px -15px $colors$slate-900-25, 0px 15px 30px -15px $colors$slate-900-50',
  '& > button': {
    justifyContent: 'flex-start',
  },
});
