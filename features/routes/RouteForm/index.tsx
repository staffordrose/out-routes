import { FC, useCallback, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { BiDetail, BiImage, BiMapAlt, BiSliderAlt } from 'react-icons/bi';

import { Tabs } from '@/components/atoms';
import { Route, RouteFeature, RouteLayer } from '@/types/routes';
import { createAlphaNumericId, parseMapBounds } from '@/utils';
import { BannerImageTab } from './BannerImageTab';
import {
  mapRecordsToValues,
  mapValuesToRecords,
  RouteFormResult,
  RouteFormValues,
  yupSchema,
} from './helpers';
import { MapTab } from './MapTab';
import { SettingsTab } from './SettingsTab';
import { SummaryTab } from './SummaryTab';

type FormTab = 'map' | 'summary' | 'banner-image' | 'settings';

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

  const [tab, setTab] = useState<FormTab>('map');

  return (
    <FormProvider {...methods}>
      <form id='route-form' onSubmit={onSubmit}>
        <Tabs
          justify='center'
          aria-label='Select form section'
          tabs={[
            {
              value: 'map',
              label: <BiMapAlt />,
              'aria-label': 'Route Map tab',
              children: (
                <MapTab
                  routeId={route?.id || createAlphaNumericId(24)}
                  routeMapBounds={parseMapBounds(route.map_bounding_box)}
                />
              ),
            },
            {
              value: 'summary',
              label: <BiDetail />,
              'aria-label': 'Route Summary tab',
              children: <SummaryTab />,
            },
            {
              value: 'banner-image',
              label: <BiImage />,
              'aria-label': 'Route Banner Image tab',
              children: <BannerImageTab />,
            },
            {
              value: 'settings',
              label: <BiSliderAlt />,
              'aria-label': 'Route Settings tab',
              children: <SettingsTab />,
            },
          ]}
          value={tab}
          onValueChange={(value: string) => {
            setTab(value as FormTab);
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
    mode: 'onBlur',
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
