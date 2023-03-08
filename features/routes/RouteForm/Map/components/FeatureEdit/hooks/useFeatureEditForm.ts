import { useState } from 'react';
import { UseFieldArrayUpdate } from 'react-hook-form';
import * as yup from 'yup';

import { MapFeature, PopupState } from '@/types';
import { getFeatureLngLat, trimFeatureSymbolCode } from '@/utils';
import { LayerValues, RouteFormValues } from '../../../../helpers';
import { updateLayerFeature } from '../../../helpers';

const yupSchema = yup.object({
  title: yup.string().max(60, `Can't be longer than 60 characters`),
  color: yup.string().nullable(),
  symbol: yup.string().nullable(),
  description: yup.string().max(280, `Can't be longer than 280 characters`),
});

type Key = 'title' | 'color' | 'symbol' | 'description';

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
    title: feature.properties?.title || '',
    color: feature.properties?.color || undefined,
    symbol: feature.properties?.symbol
      ? trimFeatureSymbolCode(feature.properties.symbol)
      : undefined,
    description: feature.properties?.description || '',
  });

  const [touched, setTouched] = useState<Record<Key, boolean>>({
    title: false,
    color: false,
    symbol: false,
    description: false,
  });

  const [errors, setErrors] = useState<Record<Key, yup.ValidationError | null>>(
    {
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
        throw new Error('Something went wrong submitting the form');
      }

      const mapFeature = {
        ...feature,
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
