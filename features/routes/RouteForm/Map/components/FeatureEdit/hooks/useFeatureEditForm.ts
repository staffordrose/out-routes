import { useState } from 'react';
import { UseFieldArrayUpdate } from 'react-hook-form';
import * as yup from 'yup';

import { GeometryTypeNames } from '@/data/routes';
import { MapFeature, PopupState } from '@/types';
import { getFeatureLngLat, trimFeatureSymbolCode } from '@/utils';
import { LayerValues, RouteFormValues } from '../../../../helpers';
import { updateLayerFeature } from '../../../helpers';

const yupSchema = yup.object({
  type: yup.string(),
  lat: yup.string().when('type', {
    is: (type: string) => type === GeometryTypeNames.Point,
    then: yup.string().min(1, 'Latitude is required').required(),
    otherwise: yup.string().nullable(),
  }),
  lng: yup.string().when('type', {
    is: (type: string) => type === GeometryTypeNames.Point,
    then: yup.string().min(1, 'Longitude is required').required(),
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

export const UseFeatureEditForm = ({
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
    color: feature.properties?.color || undefined,
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

      const latFloat = parseFloat(values.lat || '');
      const lngFloat = parseFloat(values.lng || '');

      const mapFeature = {
        ...feature,
        geometry:
          feature.geometry.type === GeometryTypeNames.Point
            ? {
                ...feature.geometry,
                coordinates: [
                  !Number.isNaN(lngFloat)
                    ? lngFloat
                    : feature.geometry.coordinates[0],
                  values.lat && !Number.isNaN(latFloat)
                    ? latFloat
                    : feature.geometry.coordinates[1],
                ],
              }
            : feature.geometry,
        properties: {
          ...feature.properties,
          title: values.title,
          color: values.color,
          symbol: values.symbol,
          description: values.description,
        },
      };

      updateLayerFeature(update, layerIndex, layer, mapFeature);

      closeFeatureEditDialog();

      openPopup({
        center: getFeatureLngLat(mapFeature),
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
