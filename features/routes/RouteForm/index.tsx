import { FC, useCallback, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Route, RouteFeature, RouteLayer } from '@/types/routes';
import { createAlphaNumericId, parseMapBounds } from '@/utils';
import { DetailsFields } from './DetailsFields';
import {
  mapRecordsToValues,
  mapValuesToRecords,
  RouteFormResult,
  RouteFormValues,
  yupSchema,
} from './helpers';
import { Map } from './Map';
import { Tabs } from '@/components/atoms';

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

  const [tab, setTab] = useState<'details' | 'map'>('details');

  return (
    <FormProvider {...methods}>
      <form id='route-form' onSubmit={onSubmit}>
        <Tabs
          justify='center'
          aria-label='Select form section'
          tabs={[
            {
              value: 'details',
              label: 'Details',
              children: <DetailsFields />,
            },
            {
              value: 'map',
              label: 'Map',
              children: (
                <Map
                  routeId={route?.id || createAlphaNumericId(24)}
                  routeMapBounds={parseMapBounds(route.map_bounding_box)}
                />
              ),
            },
          ]}
          defaultValue='details'
          value={tab}
          onValueChange={(value: string) => {
            setTab(value as 'details' | 'map');
          }}
        />
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
