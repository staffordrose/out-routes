import { FC, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Route } from '@/types/routes';
import { Fields } from './Fields';
import {
  mapValuesToRouteRecord,
  RouteSettingsFormValues,
  yupSchema,
} from './helpers';

export type RouteSettingsFormProps = {
  onSubmit: (values: Partial<Route>, helpers: { reset: () => void }) => void;
};

export const RouteSettingsForm: FC<RouteSettingsFormProps> = ({
  onSubmit: onSubmitHandler,
}) => {
  const { onSubmit, control, setValue } = useRouteSettingsForm({
    onSubmit: onSubmitHandler,
  });

  return (
    <form id='route-settings-form' onSubmit={onSubmit}>
      <Fields control={control} setValue={setValue} />
    </form>
  );
};

type UseRouteSettingsFormProps = Pick<RouteSettingsFormProps, 'onSubmit'>;

const useRouteSettingsForm = ({
  onSubmit: onSubmitHandler,
}: UseRouteSettingsFormProps) => {
  const validationSchema = useMemo(() => yupSchema, []);

  const methods = useForm<RouteSettingsFormValues>({
    mode: 'onBlur',
    defaultValues: {
      is_private: 'public',
      title: '',
      title_alt: [],
      activity_type: undefined,
      region: '',
      country: undefined,
    },
    resolver: yupResolver(validationSchema),
  });

  const { handleSubmit, reset } = methods;

  const onSubmit = useCallback(
    (values: RouteSettingsFormValues) => {
      onSubmitHandler(mapValuesToRouteRecord(values), { reset });
    },
    [reset, onSubmitHandler]
  );

  return {
    ...methods,
    onSubmit: handleSubmit(onSubmit),
  };
};
