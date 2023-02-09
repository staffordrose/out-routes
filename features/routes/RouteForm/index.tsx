import { FC, useCallback, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Route, RouteFeature, RouteLayer } from '@/types';
import { DetailsFields } from './DetailsFields';
import {
  mapRecordsToValues,
  mapValuesToRecords,
  RouteFormResult,
  RouteFormValues,
  yupSchema,
} from './helpers';
import { Map } from './Map';

export type RouteFormProps = {
  route: Route;
  layers: RouteLayer[];
  features: RouteFeature[];
  onSubmit: (values: RouteFormResult, helpers: { reset: () => void }) => void;
};

export const RouteForm: FC<RouteFormProps> = ({
  route,
  layers,
  features,
  onSubmit: onSubmitHandler,
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
        <DetailsFields />
        {!!route?.id && (
          <Map
            routeId={route.id}
            routeMapBoundingBox={
              route.map_bounding_box
                ? JSON.parse(route.map_bounding_box)
                : undefined
            }
          />
        )}
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
