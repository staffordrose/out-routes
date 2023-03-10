import { useReducer } from 'react';

import { Controls, MapFeature, Viewport } from '@/types/maps';

export type MapState = {
  mapStyle: string;
  controls: Controls;
  viewport: Viewport;
  popupFeatureId: MapFeature['id'] | null;
  selectedFeatureIds: MapFeature['id'][];
};

export type MapStateActions = {
  setMapStyle: (style: MapState['mapStyle']) => void;
  setControls: (controls: MapState['controls']) => void;
  setViewport: (viewport: Partial<MapState['viewport']>) => void;
  setPopupFeatureId: (id: MapState['popupFeatureId']) => void;
  setSelectedFeatureIds: (ids: MapState['selectedFeatureIds']) => void;
};

export const defaultState: MapState = {
  mapStyle: process.env.NEXT_PUBLIC_MAPBOX_MAP_STYLE as string,
  controls: {
    scale: {
      unit: 'imperial',
    },
  },
  viewport: {
    center: [-95.7129, 37.0902],
    zoom: 3.5,
  },
  popupFeatureId: null,
  selectedFeatureIds: [],
};

export enum ActionTypes {
  SET_MAP_STYLE = 'SET_MAP_STYLE',
  SET_VIEWPORT = 'SET_VIEWPORT',
  SET_POPUP_FEATURE_ID = 'SET_POPUP_FEATURE_ID',
  SET_SELECTED_FEATURE_IDS = 'SET_SELECTED_FEATURE_IDS',
}

type Action =
  | { type: ActionTypes.SET_MAP_STYLE; payload: MapState['mapStyle'] }
  | { type: ActionTypes.SET_VIEWPORT; payload: Partial<MapState['viewport']> }
  | {
      type: ActionTypes.SET_POPUP_FEATURE_ID;
      payload: MapState['popupFeatureId'];
    }
  | {
      type: ActionTypes.SET_SELECTED_FEATURE_IDS;
      payload: MapState['selectedFeatureIds'];
    };

export const reducer = (
  state: typeof defaultState,
  { type, payload }: Action
): MapState => {
  switch (type) {
    case ActionTypes.SET_MAP_STYLE:
      return {
        ...state,
        mapStyle: payload,
      };
    case ActionTypes.SET_VIEWPORT:
      return {
        ...state,
        viewport: {
          center: Array.isArray(payload.center)
            ? payload.center
            : state.viewport.center,
          zoom:
            typeof payload.zoom === 'number'
              ? payload.zoom
              : state.viewport.zoom,
        },
      };
    case ActionTypes.SET_POPUP_FEATURE_ID:
      return {
        ...state,
        popupFeatureId: payload,
      };
    case ActionTypes.SET_SELECTED_FEATURE_IDS:
      return {
        ...state,
        selectedFeatureIds: payload,
      };
    default:
      return state;
  }
};

export const useMapState = () => {
  const [state, dispatch] = useReducer(reducer, defaultState);

  const setPopupFeatureId = (payload: MapFeature['id'] | null): void => {
    dispatch({ type: ActionTypes.SET_POPUP_FEATURE_ID, payload });
  };

  const setSelectedFeatureIds: MapStateActions['setSelectedFeatureIds'] = (
    payload
  ) => {
    dispatch({ type: ActionTypes.SET_SELECTED_FEATURE_IDS, payload });
  };

  return {
    state,
    dispatch,
    setPopupFeatureId,
    setSelectedFeatureIds,
  };
};
