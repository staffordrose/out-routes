import { FC, useCallback, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { ToastContents } from '@/components/atoms';
import { Route, RouteFeature, RouteLayer, RouteLayersFeatures } from '@/types';
import { DetailsFields } from './DetailsFields';
import {
  mapRecordsToValues,
  mapValuesToRecords,
  RouteFormValues,
  yupSchema,
} from './helpers';
import { Map } from './Map';

export type RouteFormProps = {
  route: Route;
  layers: RouteLayer[];
  features: RouteFeature[];
  onSubmit: (
    values: RouteLayersFeatures,
    helpers: { reset: () => void }
  ) => void;
  openToast?: (contents: ToastContents) => void;
};

export const RouteForm: FC<RouteFormProps> = ({
  route,
  layers,
  features,
  onSubmit: onSubmitHandler,
  openToast,
}) => {
  const { onSubmit, ...methods } = useRouteForm({
    route,
    layers,
    features,
    onSubmit: onSubmitHandler,
  });

  return (
    <FormProvider {...methods}>
      <form id='route-form' onSubmit={onSubmit}>
        <DetailsFields routeId={route?.id} openToast={openToast} />
        {!!route?.id && <Map routeId={route.id} />}
      </form>
    </FormProvider>
  );
};

type UseRouteFormProps = Pick<
  RouteFormProps,
  'route' | 'layers' | 'features' | 'onSubmit'
>;

const useRouteForm = ({
  route,
  layers,
  features,
  onSubmit: onSubmitHandler,
}: UseRouteFormProps) => {
  const validationSchema = useMemo(() => yupSchema, []);

  const defaultValues = useMemo(
    () => mapRecordsToValues(route, layers, features),
    [route, layers, features]
  );

  const methods = useForm<RouteFormValues>({
    defaultValues,
    resolver: yupResolver(validationSchema),
  });

  const { handleSubmit, reset } = methods;

  const onSubmit = useCallback(
    (values: RouteFormValues) => {
      onSubmitHandler(mapValuesToRecords(values), { reset });
    },
    [reset, onSubmitHandler]
  );

  return {
    ...methods,
    onSubmit: handleSubmit(onSubmit),
  };
};
