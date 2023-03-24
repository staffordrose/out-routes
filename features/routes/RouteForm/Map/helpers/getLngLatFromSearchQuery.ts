import { LngLat } from '@/types/maps';
import { isValidLngLat } from '@/utils';

export const getLngLatFromSearchQuery = (query: string): LngLat | null => {
  const coordinates = query
    .trim()
    .split(',')
    .map((s: string) => s.trim())
    .map((s: string) => s.replace(/[^\d.-]/g, ''))
    .map((s: any) => (Number.isNaN(Number(s)) ? null : Number(s)))
    .filter((n: number | null) => n)
    .reverse();

  return isValidLngLat(coordinates) ? (coordinates as LngLat) : null;
};
