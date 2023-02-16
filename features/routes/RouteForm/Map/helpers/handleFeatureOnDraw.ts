import { GeometryTypeNames } from '@/data/routes';
import { getElevationByLngLat } from '@/lib/v1/api/map';
import { LngLat, MapFeature } from '@/types';
import { calculateLineStringDistance } from './calculateLineStringDistance';
import { calculatePolygonArea } from './calculatePolygonArea';
import { truncateGeometryCoordinates } from './truncateGeometryCoordinates';

export const handleFeatureOnDraw = async (feature: MapFeature) => {
  try {
    const truncated = truncateGeometryCoordinates(feature);

    const { geometry, properties } = truncated;
    const { coordinates } = geometry;

    if (geometry.type === GeometryTypeNames.Polygon) {
      const area = calculatePolygonArea(truncated);

      return {
        ...truncated,
        properties: {
          ...properties,
          layerSymbol: trimSymbol(properties.layerSymbol),
          symbol: trimSymbol(properties.symbol),
          area,
        },
      } as MapFeature;
    } else if (geometry.type === GeometryTypeNames.LineString) {
      const ele_start = await getElevationByLngLat(coordinates[0] as LngLat);

      const ele_end = await getElevationByLngLat(
        coordinates[coordinates.length - 1] as LngLat
      );

      const distance = calculateLineStringDistance(truncated);

      return {
        ...truncated,
        properties: {
          ...properties,
          layerSymbol: trimSymbol(properties.layerSymbol),
          symbol: trimSymbol(properties.symbol),
          ele_start,
          ele_end,
          distance,
        },
      } as MapFeature;
    } else if (geometry.type === GeometryTypeNames.Point) {
      const ele_start = await getElevationByLngLat(coordinates as LngLat);

      return {
        ...truncated,
        properties: {
          ...properties,
          layerSymbol: trimSymbol(properties.layerSymbol),
          symbol: trimSymbol(properties.symbol),
          ele_start,
        },
      } as MapFeature;
    } else {
      return feature as MapFeature;
    }
  } catch (error) {
    return feature as MapFeature;
  }
};

// remove 'maki-' prepended text
const trimSymbol = (symbol?: string) =>
  symbol?.includes('maki-') ? symbol.slice(5) : symbol;
