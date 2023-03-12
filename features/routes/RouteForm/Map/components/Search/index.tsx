import {
  ChangeEvent,
  FC,
  MutableRefObject,
  useCallback,
  useMemo,
  useState,
} from 'react';
import {
  UseFieldArrayAppend,
  UseFieldArrayUpdate,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import type { Map } from 'mapbox-gl';
import type MapboxDraw from '@mapbox/mapbox-gl-draw';
import { Position } from 'geojson';

import { Input } from '@/components/atoms';
import { ColorCodes } from '@/data/general';
import { GeometryTypeNames, SymbolCodes } from '@/data/routes';
import { useDebounce } from '@/hooks';
import { getElevationByLngLat } from '@/lib/v1/api/map';
import { styled } from '@/styles';
import { LngLat, MapFeature, MapLayer } from '@/types/maps';
import {
  createAlphaNumericId,
  isValidLngLat,
  roundToDecimalCount,
} from '@/utils';
import {
  LayerValues,
  mapMapboxFeatureToFeatureValues,
  RouteFormValues,
} from '../../../helpers';
import { addLayerFeature } from '../../helpers';
import { GeocodeResponse } from './GeocodeResponse';
import { Coordinates } from './Coordinates';

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
  const [query, setQuery] = useState('');

  const debouncedQuery = useDebounce(query, 300);

  const coordinates = useMemo(() => {
    const coordinates = (debouncedQuery || '')
      .trim()
      .split(',')
      .map((s: string) => s.trim())
      .map((s: string) => s.replace(/[^\d.-]/g, ''))
      .map((s: any) => (Number.isNaN(Number(s)) ? null : Number(s)))
      .filter((n: number | null) => n)
      .reverse();

    return isValidLngLat(coordinates) ? coordinates : null;
  }, [debouncedQuery]);

  const { control } = useFormContext<RouteFormValues>();

  const layers = useWatch({ control, name: 'layers' });
  const activeLayerId = useWatch({ control, name: 'activeLayerId' });

  const handleFeatureClick = useCallback(
    async ([lng, lat]: LngLat, properties?: { title?: string }) => {
      const cb = ({ databaseId }: LayerValues) => databaseId === activeLayerId;
      const layerColor =
        (activeLayerId && layers?.some(cb) && layers.find(cb)?.color) ||
        ColorCodes.Red;
      const layerSymbol =
        (activeLayerId &&
          layers?.some(cb) &&
          `maki-${layers.find(cb)?.symbol || SymbolCodes.Marker}`) ||
        `maki-${SymbolCodes.Marker}`;

      const position: Position = [
        roundToDecimalCount(lng, { decimalCount: 6 }),
        roundToDecimalCount(lat, { decimalCount: 6 }),
      ];

      const ele = await getElevationByLngLat([lng, lat]);

      if (typeof ele === 'number') {
        position.push(roundToDecimalCount(ele, { decimalCount: 3 }));
      }

      const f = {
        id: createAlphaNumericId(24),
        type: 'Feature',
        geometry: {
          type: GeometryTypeNames.Point,
          coordinates: position,
        },
        properties: {
          layerColor,
          layerSymbol,
          title: properties?.title || '',
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
          features: [mapMapboxFeatureToFeatureValues(f)],
        });

        setActiveLayerId(newLayerId);
      } else {
        addLayerFeature(update, layers, activeLayerId, f);
      }

      // fly to new feature
      map.current?.flyTo({ center: [position[0], position[1]], zoom: 14 });

      setQuery('');
    },
    [append, update, map, draw, layers, activeLayerId, setActiveLayerId]
  );

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
      {!!debouncedQuery && (
        <Menu>
          {coordinates !== null ? (
            <Coordinates
              coordinates={coordinates}
              handleFeatureClick={handleFeatureClick}
            />
          ) : (
            <GeocodeResponse
              query={debouncedQuery}
              handleFeatureClick={handleFeatureClick}
            />
          )}
        </Menu>
      )}
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
  width: 'calc($full - $20)',
  maxWidth: '$112',
  '& > input': {
    width: '$full',
    backgroundColor: '$white',
  },
  '& > button': {
    flexShrink: 0,
  },
});

const Menu = styled('div', {
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
