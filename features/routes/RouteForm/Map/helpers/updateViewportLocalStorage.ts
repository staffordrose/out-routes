import { Route, Viewport } from '@/types';
import { isLocalStorageAvailable } from '@/utils';

export const updateViewportLocalStorage = (
  routeId: Route['id'],
  { center, zoom }: Partial<Viewport>
) => {
  if (!isLocalStorageAvailable()) return;

  if (Array.isArray(center)) {
    localStorage.setItem(`mapid:${routeId}-center`, JSON.stringify(center));
  }
  if (typeof zoom === 'number') {
    zoom && localStorage.setItem(`mapid:${routeId}-zoom`, JSON.stringify(zoom));
  }
};
