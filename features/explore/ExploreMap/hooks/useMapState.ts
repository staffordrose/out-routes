import { useReducer } from 'react';

import { Controls, Viewport } from '@/types/maps';
import { Route } from '@/types/routes';

export type MapState = {
  isMapLoaded: boolean;
  mapStyle: string;
  controls: Controls;
  viewport: Viewport;
  popupFeatureId: Route['id'] | null;
};

export type MapStateActions = {
  setMapLoaded: (isMapLoaded: MapState['isMapLoaded']) => void;
  setMapStyle: (style: MapState['mapStyle']) => void;
  setControls: (controls: MapState['controls']) => void;
  setViewport: (viewport: Partial<MapState['viewport']>) => void;
  setPopupFeatureId: (id: MapState['popupFeatureId']) => void;
};

export const defaultState: MapState = {
  isMapLoaded: false,
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
};

export enum ActionTypes {
  SET_MAP_STYLE = 'SET_MAP_STYLE',
  SET_VIEWPORT = 'SET_VIEWPORT',
  SET_MAP_LOADED = 'SET_MAP_LOADED',
  SET_POPUP_FEATURE_ID = 'SET_POPUP_FEATURE_ID',
}

type Action =
  | { type: ActionTypes.SET_MAP_LOADED; payload: MapState['isMapLoaded'] }
  | { type: ActionTypes.SET_MAP_STYLE; payload: MapState['mapStyle'] }
  | { type: ActionTypes.SET_VIEWPORT; payload: Partial<MapState['viewport']> }
  | {
      type: ActionTypes.SET_POPUP_FEATURE_ID;
      payload: MapState['popupFeatureId'];
    };

export const reducer = (
  state: typeof defaultState,
  { type, payload }: Action
): MapState => {
  switch (type) {
    case ActionTypes.SET_MAP_LOADED:
      return {
        ...state,
        isMapLoaded: payload,
      };
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
    default:
      return state;
  }
};

export const useMapState = () => {
  const [state, dispatch] = useReducer(reducer, defaultState);

  const setMapLoaded = (payload: boolean): void => {
    dispatch({ type: ActionTypes.SET_MAP_LOADED, payload });
  };

  const setPopupFeatureId = (payload: Route['id'] | null): void => {
    dispatch({ type: ActionTypes.SET_POPUP_FEATURE_ID, payload });
  };

  return {
    state,
    dispatch,
    setMapLoaded,
    setPopupFeatureId,
  };
};
