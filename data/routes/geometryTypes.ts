export enum GeometryTypes {
  Point = 'point',
  LineString = 'line-string',
  Polygon = 'polygon',
}

export enum GeometryTypeNames {
  Point = 'Point',
  LineString = 'LineString',
  Polygon = 'Polygon',
}

export enum GeometryTypeLabels {
  Point = 'Point',
  LineString = 'Line',
  Polygon = 'Shape',
}

export const geometryTypes: Record<GeometryTypeNames, GeometryTypes> = {
  [GeometryTypeNames.Point]: GeometryTypes.Point,
  [GeometryTypeNames.LineString]: GeometryTypes.LineString,
  [GeometryTypeNames.Polygon]: GeometryTypes.Polygon,
};

export const geometryTypeNames: Record<GeometryTypes, GeometryTypeNames> = {
  [GeometryTypes.Point]: GeometryTypeNames.Point,
  [GeometryTypes.LineString]: GeometryTypeNames.LineString,
  [GeometryTypes.Polygon]: GeometryTypeNames.Polygon,
};

export const geometryTypeLabels: Record<GeometryTypes, GeometryTypeLabels> = {
  [GeometryTypes.Point]: GeometryTypeLabels.Point,
  [GeometryTypes.LineString]: GeometryTypeLabels.LineString,
  [GeometryTypes.Polygon]: GeometryTypeLabels.Polygon,
};

export const geometryTypeSelectOptions: Array<{
  value: GeometryTypes;
  label: GeometryTypeLabels;
}> = (
  Object.entries(geometryTypeLabels) as Array<
    [GeometryTypes, GeometryTypeLabels]
  >
).map((c) => ({
  value: c[0],
  label: c[1],
}));
