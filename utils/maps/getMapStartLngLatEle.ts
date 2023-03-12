import { GeometryTypeNames } from '@/data/routes';
import { MapFeature, MapLayer } from '@/types/maps';

export const getMapStartLngLatEle = (
  mapLayers: MapLayer[]
): { lng?: number; lat?: number; ele?: number } => {
  const featureCb = (feature: MapFeature) =>
    [GeometryTypeNames.Point, GeometryTypeNames.LineString].includes(
      feature.geometry.type as GeometryTypeNames
    );

  const firstLayerWithPointOrLineString = mapLayers.find(({ data }) => {
    return data.features?.find(featureCb);
  });

  if (!firstLayerWithPointOrLineString) {
    return { lng: undefined, lat: undefined, ele: undefined };
  }

  const firstPointOrLineString =
    firstLayerWithPointOrLineString.data.features?.find(featureCb);

  if (!firstPointOrLineString) {
    return { lng: undefined, lat: undefined, ele: undefined };
  }

  const { geometry } = firstPointOrLineString;

  if (geometry.type === GeometryTypeNames.Point) {
    return {
      lng: geometry.coordinates[0],
      lat: geometry.coordinates[1],
      ele: geometry.coordinates[2],
    };
  } else if (geometry.type === GeometryTypeNames.LineString) {
    return {
      lng: geometry.coordinates[0][0],
      lat: geometry.coordinates[0][1],
      ele: geometry.coordinates[0][2],
    };
  } else {
    return { lng: undefined, lat: undefined, ele: undefined };
  }
};
