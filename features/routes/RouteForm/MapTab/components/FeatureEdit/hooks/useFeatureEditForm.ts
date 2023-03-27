import { useState } from 'react';
import { UseFieldArrayUpdate } from 'react-hook-form';
import * as yup from 'yup';
import { Position } from 'geojson';

import { ColorCodes, colorCodes, colorNames, ColorNames } from '@/data/general';
import { GeometryTypeNames } from '@/data/routes';
import { getFeatureElevations } from '@/lib/v1/api/map';
import { MapFeature, PopupState } from '@/types/maps';
import {
  getMapFeatureCenter,
  isValidLngLat,
  trimFeatureSymbolCode,
} from '@/utils';
import { LayerValues, RouteFormValues } from '../../../../helpers';
import { updateLayerFeature } from '../../../helpers';

const yupSchema = yup.object({
  type: yup.string(),
  lat: yup.string().when('type', {
    is: (type: string) => type === GeometryTypeNames.Point,
    then: yup
      .string()
      .test(
        'is-valid-lat',
        () => `Latitude must be between -90 and 90`,
        (value) => {
          const float = parseFloat(value || '');
          return !Number.isNaN(float) && float >= -90 && float <= 90;
        }
      )
      .required('Latitude is required'),
    otherwise: yup.string().nullable(),
  }),
  lng: yup.string().when('type', {
    is: (type: string) => type === GeometryTypeNames.Point,
    then: yup
      .string()
      .test(
        'is-valid-lng',
        () => `Longitude must be between -180 and 180`,
        (value) => {
          const float = parseFloat(value || '');
          return !Number.isNaN(float) && float >= -180 && float <= 180;
        }
      )
      .required('Longitude is required'),
    otherwise: yup.string().nullable(),
  }),
  title: yup.string().max(60, `Can't be longer than 60 characters`),
  color: yup.string().nullable(),
  symbol: yup.string().nullable(),
  description: yup.string().max(280, `Can't be longer than 280 characters`),
});

type Key =
  | 'type'
  | 'lat'
  | 'lng'
  | 'title'
  | 'color'
  | 'symbol'
  | 'description';

type UseFeatureEditFormProps = {
  update: UseFieldArrayUpdate<RouteFormValues, 'layers'>;
  layerIndex: number;
  layer: LayerValues;
  feature: MapFeature;
  openPopup: (popupState: PopupState) => void;
  closeFeatureEditDialog: () => void;
};

export const useFeatureEditForm = ({
  update,
  layerIndex,
  layer,
  feature,
  openPopup,
  closeFeatureEditDialog,
}: UseFeatureEditFormProps) => {
  const [status, setStatus] = useState('');

  const [values, setValues] = useState<Record<Key, string | undefined>>({
    type: feature.geometry?.type || '',
    lat:
      feature.geometry?.type === GeometryTypeNames.Point
        ? feature.geometry.coordinates[1].toString()
        : undefined,
    lng:
      feature.geometry?.type === GeometryTypeNames.Point
        ? feature.geometry.coordinates[0].toString()
        : undefined,
    title: feature.properties?.title || '',
    color: feature.properties?.color
      ? colorNames[feature.properties.color as ColorCodes]
      : undefined,
    symbol: feature.properties?.symbol
      ? trimFeatureSymbolCode(feature.properties.symbol)
      : undefined,
    description: feature.properties?.description || '',
  });

  const [touched, setTouched] = useState<Record<Key, boolean>>({
    type: false,
    lat: false,
    lng: false,
    title: false,
    color: false,
    symbol: false,
    description: false,
  });

  const [errors, setErrors] = useState<Record<Key, yup.ValidationError | null>>(
    {
      type: null,
      lat: null,
      lng: null,
      title: null,
      color: null,
      symbol: null,
      description: null,
    }
  );

  const updateValues = (
    property: Key,
    value:
      | typeof values.lat
      | typeof values.lng
      | typeof values.title
      | typeof values.color
      | typeof values.symbol
      | typeof values.description
  ) => {
    setValues((prev) => ({
      ...prev,
      [property]: value,
    }));
  };

  const updateTouched = (property: Key, value: boolean) => {
    setTouched((prev) => ({
      ...prev,
      [property]: value,
    }));
  };

  const updateErrors = (property: Key, value: yup.ValidationError | null) => {
    setErrors((prev) => ({
      ...prev,
      [property]: value,
    }));
  };

  const validate = async () => {
    for (const value in values) {
      try {
        await yupSchema.validateAt(value, values);

        if (errors[value as Key]) {
          updateErrors(value as Key, null);
        }
      } catch (error) {
        if (error instanceof yup.ValidationError) {
          updateErrors(value as Key, error);
        }
      }
    }
  };

  const onSubmit = async () => {
    try {
      setStatus('');

      await validate();

      if (Object.values(errors).some((error) => error !== null)) {
        return;
      }

      let coordinates: Position = [];

      if (feature.geometry.type === GeometryTypeNames.Point) {
        const latFloat = parseFloat(values.lat || '');
        const lngFloat = parseFloat(values.lng || '');

        coordinates = isValidLngLat([lngFloat, latFloat])
          ? [lngFloat, latFloat]
          : [feature.geometry.coordinates[0], feature.geometry.coordinates[1]];

        if (
          lngFloat !== feature.geometry.coordinates[0] ||
          latFloat !== feature.geometry.coordinates[1]
        ) {
          // get elevation for updated [lng, lat]
          const elevations = await getFeatureElevations({
            type: feature.geometry.type,
            coordinates,
          });

          if (
            Array.isArray(elevations) &&
            typeof elevations[0] === 'number' &&
            !Number.isNaN(elevations[0])
          ) {
            coordinates.push(elevations[0]);
          } else {
            coordinates.push(0);
          }
        } else {
          // use existing elevation
          coordinates.push(feature.geometry.coordinates[2] || 0);
        }
      }

      const mapFeature = {
        ...feature,
        geometry:
          feature.geometry.type === GeometryTypeNames.Point
            ? ({
                ...feature.geometry,
                coordinates,
              } as MapFeature['geometry'])
            : feature.geometry,
        properties: {
          ...feature.properties,
          title: values.title,
          color: colorCodes[values.color as ColorNames],
          symbol: values.symbol,
          description: values.description,
        },
      };

      updateLayerFeature(update, layerIndex, layer, mapFeature);

      closeFeatureEditDialog();

      openPopup({
        center: getMapFeatureCenter(mapFeature),
        feature: mapFeature,
      });
    } catch (error) {
      if (error instanceof Error) {
        setStatus(error.message);
      }
    }
  };

  return {
    status,
    values,
    touched,
    errors,
    updateValues,
    updateTouched,
    updateErrors,
    validate,
    onSubmit,
  };
};
