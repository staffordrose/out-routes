import { useState } from 'react';
import { UseFieldArrayUpdate } from 'react-hook-form';
import * as yup from 'yup';

import { LayerValues, RouteFormValues } from '../../../../../../../helpers';

const yupSchema = yup.object({
  title: yup.string().max(60, `Can't be longer than 60 characters`),
  color: yup.string(),
  symbol: yup.string(),
});

type Key = 'title' | 'color' | 'symbol';

type UseLayerEditFormProps = {
  update: UseFieldArrayUpdate<RouteFormValues, 'layers'>;
  layerIndex: number;
  layer: LayerValues;
};

export const useLayerEditForm = ({
  update,
  layerIndex,
  layer,
}: UseLayerEditFormProps) => {
  const [status, setStatus] = useState('');

  const [values, setValues] = useState<Record<Key, string>>({
    title: layer.title,
    color: layer.color,
    symbol: layer.symbol,
  });

  const [touched, setTouched] = useState<Record<Key, boolean>>({
    title: false,
    color: false,
    symbol: false,
  });

  const [errors, setErrors] = useState<Record<Key, yup.ValidationError | null>>(
    {
      title: null,
      color: null,
      symbol: null,
    }
  );

  const handleSetValues = (
    property: Key,
    value: typeof values.title | typeof values.color | typeof values.symbol
  ) => {
    setValues((prev) => ({
      ...prev,
      [property]: value,
    }));
  };

  const handleSetTouched = (property: Key, value: boolean) => {
    setTouched((prev) => ({
      ...prev,
      [property]: value,
    }));
  };

  const handleSetErrors = (
    property: Key,
    value: yup.ValidationError | null
  ) => {
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
          handleSetErrors(value as Key, null);
        }
      } catch (error) {
        if (error instanceof yup.ValidationError) {
          handleSetErrors(value as Key, error);
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

      update(layerIndex, {
        ...layer,
        title: values.title,
        color: values.color,
        symbol: values.symbol,
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
    setValues: handleSetValues,
    setTouched: handleSetTouched,
    validate,
    onSubmit,
  };
};
