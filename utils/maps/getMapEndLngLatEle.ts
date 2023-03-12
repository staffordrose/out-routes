import { GeometryTypeNames } from '@/data/routes';
import { MapFeature, MapLayer } from '@/types/maps';

export const getMapEndLngLatEle = (
  mapLayers: MapLayer[]
): { lng?: number; lat?: number; ele?: number } => {
  const featureCb = (feature: MapFeature) =>
    [GeometryTypeNames.Point, GeometryTypeNames.LineString].includes(
      feature.geometry.type as GeometryTypeNames
    );

  const lastLayerWithPointOrLineString = Array.from(mapLayers || [])
    .reverse()
    .find(({ data }) => {
      return Array.from(data.features || [])
        .reverse()
        .find(featureCb);
    });

  if (!lastLayerWithPointOrLineString) {
    return { lng: undefined, lat: undefined, ele: undefined };
  }

  const lastPointOrLineString = Array.from(
    lastLayerWithPointOrLineString.data.features || []
  )
    .reverse()
    .find(featureCb);

  if (!lastPointOrLineString) {
    return { lng: undefined, lat: undefined, ele: undefined };
  }

  const { geometry } = lastPointOrLineString;

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
