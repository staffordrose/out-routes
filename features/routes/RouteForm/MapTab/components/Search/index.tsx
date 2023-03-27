import {
  ChangeEvent,
  FC,
  KeyboardEvent,
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
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
import { BiSearch, BiX } from 'react-icons/bi';

import { IconButton } from '@/components/atoms';
import { StandardColorNames } from '@/data/general';
import { GeometryTypeNames, SymbolCodes } from '@/data/routes';
import { useDebounce } from '@/hooks';
import { getFeatureElevations } from '@/lib/v1/api/map';
import { styled } from '@/styles';
import { LngLat, MapFeature, MapLayer, PopupState } from '@/types/maps';
import { createAlphaNumericId, round } from '@/utils';
import {
  LayerValues,
  mapMapboxFeatureToFeatureValues,
  RouteFormValues,
} from '../../../helpers';
import { addLayerFeature, getLngLatFromSearchQuery } from '../../helpers';
import { GeocodeResponse } from './GeocodeResponse';
import { Coordinates } from './Coordinates';

type SearchProps = {
  append: UseFieldArrayAppend<RouteFormValues, 'layers'>;
  update: UseFieldArrayUpdate<RouteFormValues, 'layers'>;
  map: MutableRefObject<Map | undefined>;
  draw: MutableRefObject<MapboxDraw | undefined>;
  openPopup: (
    popupState: PopupState & { layerValues?: LayerValues | void }
  ) => void;
  setActiveLayerId: (id: MapLayer['id'] | null) => void;
};

export const Search: FC<SearchProps> = ({
  append,
  update,
  map,
  draw,
  openPopup,
  setActiveLayerId,
}) => {
  const [query, setQuery] = useState('');

  const debouncedQuery = useDebounce(query, 300);

  const coordinates = useMemo(
    () => getLngLatFromSearchQuery(debouncedQuery || ''),
    [debouncedQuery]
  );

  const { control } = useFormContext<RouteFormValues>();

  const layers = useWatch({ control, name: 'layers' });
  const activeLayerId = useWatch({ control, name: 'activeLayerId' });

  const handleFeatureClick = useCallback(
    async ([lng, lat]: LngLat, properties?: { title?: string }) => {
      const cb = ({ databaseId }: LayerValues) => databaseId === activeLayerId;
      const layerColor =
        (activeLayerId && layers?.some(cb) && layers.find(cb)?.color) ||
        StandardColorNames.Red;
      const layerSymbol =
        (activeLayerId &&
          layers?.some(cb) &&
          `maki-${layers.find(cb)?.symbol || SymbolCodes.Marker}`) ||
        `maki-${SymbolCodes.Marker}`;

      const layerId = activeLayerId || createAlphaNumericId(24);

      const position: LngLat = [round(lng, 6), round(lat, 6)];

      const elevations = await getFeatureElevations({
        type: GeometryTypeNames.Point,
        coordinates: position,
      });

      if (Array.isArray(elevations) && typeof elevations[0] === 'number') {
        position.push(round(elevations[0], 3));
      }

      const mapFeature = {
        id: createAlphaNumericId(24),
        type: 'Feature',
        geometry: {
          type: GeometryTypeNames.Point,
          coordinates: position as Position,
        },
        properties: {
          layer: layerId,
          layerColor,
          layerSymbol,
          title: properties?.title || '',
        },
      } as MapFeature;

      // add feature to map
      draw.current?.add(mapFeature);

      if (!activeLayerId) {
        const layerValues = {
          databaseId: layerId,
          title: '',
          color: StandardColorNames.Red,
          symbol: SymbolCodes.Marker,
          features: [mapMapboxFeatureToFeatureValues(mapFeature)],
        };

        append(layerValues);

        setActiveLayerId(layerId);

        // manually add RouteForm layerValues
        openPopup({
          center: position,
          layerValues,
          feature: mapFeature,
        });
      } else {
        addLayerFeature(update, layers, activeLayerId, mapFeature);

        openPopup({
          center: position,
          feature: mapFeature,
        });
      }

      // fly to new feature
      map.current?.flyTo({ center: position, zoom: 14 });

      setQuery('');
    },
    [
      append,
      update,
      map,
      draw,
      layers,
      activeLayerId,
      openPopup,
      setActiveLayerId,
    ]
  );

  const containerEl = useRef<HTMLDivElement>(null);
  const inputEl = useRef<HTMLInputElement>(null);

  const closeSearch = useCallback(() => {
    setQuery('');
    if (inputEl.current) inputEl.current.blur();
  }, [inputEl, setQuery]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerEl.current &&
        !containerEl.current.contains(e.target as Node)
      ) {
        closeSearch();
      }
    }

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [containerEl, closeSearch]);

  const clearBtnEl = useRef<HTMLButtonElement>(null);
  const coordinatesEl = useRef<HTMLButtonElement>(null);
  const geocodeResponseEls = useRef<HTMLButtonElement[]>([]);

  const [geocodeResponseElActiveIndex, setGeocodeResponseElActiveIndex] =
    useState<number | null>(null);

  const isCoordinates = coordinates !== null;

  return (
    <StyledSearch
      ref={containerEl}
      onKeyDown={(e) => {
        if (e.code === 'Escape') {
          closeSearch();
        }
      }}
    >
      <SearchInput showClearBtn={!!debouncedQuery}>
        <BiSearch />
        <input
          ref={inputEl}
          type='text'
          placeholder='Search'
          value={query}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setQuery(e.target.value)
          }
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
            if (
              (e.code === 'Enter' || e.code === 'ArrowDown') &&
              debouncedQuery.length
            ) {
              e.preventDefault();

              if (isCoordinates && coordinatesEl.current) {
                coordinatesEl.current.focus();
              } else if (!isCoordinates && geocodeResponseEls.current.length) {
                setGeocodeResponseElActiveIndex(0);
                geocodeResponseEls.current[0].focus();
              }
            }
          }}
        />
        <IconButton
          ref={clearBtnEl}
          type='button'
          variant='ghost'
          size='xs'
          aria-label='Clear search'
          onClick={() => {
            setQuery('');
            if (inputEl.current) inputEl.current.focus();
          }}
          onKeyDown={(e: KeyboardEvent<HTMLButtonElement>) => {
            if (e.code === 'Tab' && debouncedQuery.length) {
              e.preventDefault();

              if (isCoordinates && coordinatesEl.current) {
                coordinatesEl.current.focus();
              } else if (!isCoordinates && geocodeResponseEls.current.length) {
                setGeocodeResponseElActiveIndex(0);
                geocodeResponseEls.current[0].focus();
              }
            }
          }}
        >
          <BiX />
        </IconButton>
      </SearchInput>
      {!!debouncedQuery && (
        <Menu>
          {isCoordinates ? (
            <Coordinates
              inputEl={inputEl}
              coordinatesEl={coordinatesEl}
              coordinates={coordinates}
              handleFeatureClick={handleFeatureClick}
            />
          ) : (
            <GeocodeResponse
              inputEl={inputEl}
              geocodeResponseEls={geocodeResponseEls}
              geocodeResponseElActiveIndex={geocodeResponseElActiveIndex}
              setGeocodeResponseElActiveIndex={setGeocodeResponseElActiveIndex}
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
});

const SearchInput = styled('div', {
  display: 'flex',
  alignItems: 'center',
  width: '$full',
  height: '$8',
  paddingLeft: '$2',
  paddingRight: '$px',
  borderWidth: '$1',
  borderStyle: 'solid',
  borderColor: '$slate-300',
  borderRadius: '$md',
  backgroundColor: '$white',
  '& > input': {
    all: 'unset',
    boxSizing: 'border-box',
    display: 'inline-flex',
    alignItems: 'center',
    width: '$full',
    height: '$full',
    padding: '0 $1',
    fontSize: '$md',
    lineHeight: '$xs',
    textAlign: 'left',
    color: '$slate-900',
    cursor: 'text',
    '&:disabled': {
      cursor: 'not-allowed',
    },
  },
  '& > svg': {
    flexShrink: 0,
    width: '$5_5',
    height: '$5_5',
    fill: '$slate-800',
    opacity: 0.5,
  },
  '& > button': {
    flexShrink: 0,
    display: 'none',
    visibility: 'hidden',
  },
  '&:hover': {
    borderColor: '$slate-700',
    backgroundColor: '$slate-50',
    '& > svg': {
      opacity: 1,
    },
  },
  '&:focus-within': {
    borderColor: '$slate-700',
    backgroundColor: '$slate-50',
    outlineWidth: '$1',
    outlineStyle: 'solid',
    outlineColor: '$blue-300',
    '& > svg': {
      opacity: 1,
    },
  },
  '&:has(input:disabled)': {
    opacity: 0.5,
  },
  variants: {
    showClearBtn: {
      true: {
        '& > button': {
          display: 'inline-flex',
          visibility: 'visible',
        },
      },
    },
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
