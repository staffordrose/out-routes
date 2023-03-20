import { GeometryTypeNames } from '@/data/routes';
import { MapFeature } from '@/types/maps';
import { getMapFeatureDistances } from '@/utils';
import { calculatePolygonArea } from './calculatePolygonArea';
import { truncateGeometryCoordinates } from './truncateGeometryCoordinates';

export const handleFeatureOnDraw = (feature: MapFeature): MapFeature => {
  let truncated = truncateGeometryCoordinates(feature);

  truncated = {
    ...truncated,
    properties: {
      ...truncated.properties,
      layerSymbol: trimSymbol(truncated.properties.layerSymbol),
      symbol: trimSymbol(truncated.properties.symbol),
    },
  } as MapFeature;

  if (truncated.geometry.type === GeometryTypeNames.Polygon) {
    const area = calculatePolygonArea(truncated);

    return {
      ...truncated,
      properties: {
        ...truncated.properties,
        area,
      },
    };
  } else if (truncated.geometry.type === GeometryTypeNames.LineString) {
    const { totalDistance: distance } = getMapFeatureDistances(truncated);

    return {
      ...truncated,
      properties: {
        ...truncated.properties,
        distance,
      },
    };
  } else if (truncated.geometry.type === GeometryTypeNames.Point) {
    return truncated;
  } else {
    return feature as MapFeature;
  }
};

// remove 'maki-' prepended text
const trimSymbol = (symbol?: string) =>
  symbol?.includes('maki-') ? symbol.slice(5) : symbol;
