import { useCallback, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import {
  UseFieldArrayAppend,
  UseFieldArrayUpdate,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import { LngLatBounds, Map, Marker, Popup } from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';

import { mapboxgl } from '@/lib/client';
import { LngLat, MapFeature, MapLayer, PopupState } from '@/types/maps';
import { Route } from '@/types/routes';
import { RouteMapPopup } from '../../../RouteMapPopup';
import { LayerValues, RouteFormValues } from '../../helpers';
import { getLayerValuesById } from '../helpers';
import {
  useDrawFeatures,
  useMapState,
  useOnDrawCreate,
  useOnDrawDelete,
  useOnDrawSelectionChange,
  useOnDrawUpdate,
  useSetInitialViewport,
  useSetupMap,
} from '.';

export type UseMapProps = {
  append: UseFieldArrayAppend<RouteFormValues, 'layers'>;
  update: UseFieldArrayUpdate<RouteFormValues, 'layers'>;
  routeId: Route['id'];
  routeMapBounds?: LngLatBounds | null;
  openFeatureEditDialog: (
    layerIndex: number,
    layer: LayerValues,
    feature: MapFeature
  ) => void;
};

export const useMap = ({
  append,
  update,
  routeId,
  routeMapBounds,
  openFeatureEditDialog,
}: UseMapProps) => {
  const { state, setSelectedFeatureIds, setPopupFeatureId } = useMapState();

  const { control, setValue } = useFormContext<RouteFormValues>();
  const layers = useWatch({ control, name: 'layers' });
  const activeLayerId = useWatch({ control, name: 'activeLayerId' });

  const setActiveLayerId = useCallback(
    (id: MapLayer['id'] | null) => {
      setValue('activeLayerId', id);
    },
    [setValue]
  );

  const mapContainerEl = useRef<HTMLDivElement>(null);
  const map = useRef<Map>();
  const draw = useRef<MapboxDraw>();
  const popupEl = useRef<Popup | null>(null);
  const trackMarkerEl = useRef<Marker | null>(null);

  // initialize map & draw, set controls & load icons
  useSetupMap({
    state,
    mapContainerEl,
    map,
    draw,
  });

  useSetInitialViewport({
    routeId,
    map,
    routeMapBounds,
    layers,
  });

  useDrawFeatures({
    map,
    draw,
    layers,
  });

  const openPopup = useCallback(
    ({
      center,
      layerValues,
      feature,
    }: PopupState & { layerValues?: LayerValues | void }): void => {
      if (!map.current) return;

      // close existing popup
      if (popupEl.current) {
        popupEl.current.remove();
      }

      setPopupFeatureId(feature.id);

      if (!layerValues) {
        layerValues = getLayerValuesById(layers, feature.properties.layer);
      }

      if (!layerValues) return;

      // create popup root
      const popupNode = document.createElement('div');
      const popupRoot = createRoot(popupNode);
      popupRoot.render(
        <RouteMapPopup>
          <RouteMapPopup.ActionHeader
            layerIndex={layers.findIndex(
              (layer) => layer.databaseId === feature.properties.layer
            )}
            layer={layerValues}
            feature={feature}
            openFeatureEditDialog={openFeatureEditDialog}
          />
          <RouteMapPopup.Content feature={feature} />
        </RouteMapPopup>
      );

      popupEl.current = new mapboxgl.Popup({
        closeButton: false,
        maxWidth: '224px',
      })
        .setLngLat(center)
        .setDOMContent(popupNode)
        .addTo(map.current);
    },
    [layers, setPopupFeatureId, openFeatureEditDialog]
  );

  const closePopup = useCallback(() => {
    if (popupEl.current) {
      popupEl.current.remove();
    }

    setPopupFeatureId(null);
  }, [setPopupFeatureId]);

  const setTrackMarker = useCallback((lngLat: LngLat) => {
    if (!map.current) return;

    // hide track marker
    if (trackMarkerEl.current) {
      trackMarkerEl.current.remove();
    }

    const markerNode = document.createElement('div');
    markerNode.className = 'mapboxgl-track-marker';

    trackMarkerEl.current = new mapboxgl.Marker(markerNode)
      .setLngLat(lngLat)
      .addTo(map.current);
  }, []);

  const hideTrackMarker = useCallback(() => {
    if (trackMarkerEl.current) {
      trackMarkerEl.current.remove();
    }
  }, []);

  useOnDrawCreate({
    append,
    update,
    map,
    draw,
    layers,
    activeLayerId,
    setActiveLayerId,
  });

  useOnDrawUpdate({
    update,
    map,
    openPopup,
    layers,
    activeLayerId,
    popupFeatureId: state.popupFeatureId,
  });

  useOnDrawDelete({
    update,
    map,
    layers,
    closePopup,
  });

  useOnDrawSelectionChange({
    map,
    layers,
    activeLayerId,
    openPopup,
    setActiveLayerId,
    setSelectedFeatureIds,
  });

  return {
    mapContainerEl,
    map,
    draw,
    openPopup,
    closePopup,
    setTrackMarker,
    hideTrackMarker,
    setActiveLayerId,
  };
};
