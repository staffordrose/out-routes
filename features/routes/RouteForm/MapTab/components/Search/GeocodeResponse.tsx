import { FC, KeyboardEvent, MutableRefObject, RefObject } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BiSearch } from 'react-icons/bi';

import { Feedback } from '@/components/layout';
import { Button } from '@/components/atoms';
import { geocodingDataTypeIcons, GeocodingDataTypes } from '@/data/routes';
import { geocodeQuery } from '@/lib/v1/api/map';
import { LngLat } from '@/types/maps';

type GeocodeResponseProps = {
  inputEl: RefObject<HTMLInputElement>;
  geocodeResponseEls: MutableRefObject<HTMLButtonElement[]>;
  geocodeResponseElActiveIndex: number | null;
  setGeocodeResponseElActiveIndex: (activeBtn: number | null) => void;
  query: string;
  handleFeatureClick: (lngLat: LngLat, properties?: { title?: string }) => void;
};

export const GeocodeResponse: FC<GeocodeResponseProps> = ({
  inputEl,
  geocodeResponseEls,
  geocodeResponseElActiveIndex,
  setGeocodeResponseElActiveIndex,
  query,
  handleFeatureClick,
}) => {
  const searchQuery = useQuery({
    queryKey: ['route-form-map-geocode', query],
    queryFn: () => geocodeQuery(query),
    staleTime: 300_000,
    enabled: !!query,
  });

  if (searchQuery.isLoading && searchQuery.isFetching) {
    return <Feedback size='xs' type='loading' title='Loading' />;
  }
  if (searchQuery.isError) {
    return (
      <Feedback size='xs' type='error' title='Something went wrong'>
        {searchQuery.error instanceof Error ? searchQuery.error.message : null}
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
      <>
        {features.map((feature, featureIndex) => {
          const { id, center, place_name, place_type, text } = feature;

          const Icon =
            geocodingDataTypeIcons[place_type[0] as GeocodingDataTypes];

          return (
            <Button
              ref={(el) =>
                el ? (geocodeResponseEls.current[featureIndex] = el) : null
              }
              key={id}
              type='button'
              variant='ghost'
              size='xs'
              onClick={() => handleFeatureClick(center, { title: text })}
              onKeyDown={(e: KeyboardEvent<HTMLButtonElement>) => {
                if (e.code === 'ArrowUp') {
                  e.preventDefault();

                  if (typeof geocodeResponseElActiveIndex === 'number') {
                    if (geocodeResponseElActiveIndex > 0) {
                      const nextIndex = geocodeResponseElActiveIndex - 1;

                      if (geocodeResponseEls.current[nextIndex]) {
                        setGeocodeResponseElActiveIndex(nextIndex);
                        geocodeResponseEls.current[nextIndex].focus();
                      }
                    } else if (inputEl.current) {
                      setGeocodeResponseElActiveIndex(null);
                      inputEl.current.focus();
                    }
                  }
                } else if (e.code === 'ArrowDown') {
                  e.preventDefault();

                  if (
                    typeof geocodeResponseElActiveIndex === 'number' &&
                    geocodeResponseElActiveIndex < features.length - 1
                  ) {
                    const nextIndex = geocodeResponseElActiveIndex + 1;

                    if (geocodeResponseEls.current[nextIndex]) {
                      setGeocodeResponseElActiveIndex(nextIndex);
                      geocodeResponseEls.current[nextIndex].focus();
                    }
                  }
                }
              }}
            >
              <Icon />
              <span>{place_name}</span>
            </Button>
          );
        })}
      </>
    );
  }
  return null;
};
