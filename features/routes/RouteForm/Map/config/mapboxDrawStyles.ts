import { GeometryTypeNames } from '@/data/routes';

const pointLayout = {
  'icon-image': [
    'coalesce',
    ['get', 'user_symbol'],
    ['get', 'user_layerSymbol'],
    'maki-marker',
  ],
  'icon-size': 1.25,
  'icon-offset': [0, 4],
  'icon-anchor': 'bottom',
  'icon-allow-overlap': true,
  'symbol-sort-key': 2,
};

const pointPaint = {
  'icon-color': [
    'coalesce',
    ['get', 'user_color'],
    ['get', 'user_layerColor'],
    'null',
  ],
  'icon-halo-blur': 3,
  'icon-halo-color': 'rgba(0,0,0,0.25)',
  'icon-halo-width': 3,
};

const lineLayout = {
  'line-cap': 'round',
  'line-join': 'round',
  'line-sort-key': 1,
};

const linePaint = {
  'line-color': [
    'coalesce',
    ['get', 'user_color'],
    ['get', 'user_layerColor'],
    'null',
  ],
  'line-width': 4,
};

const polygonLayout = {
  'fill-sort-key': 0,
};

const polygonPaint = {
  'fill-color': [
    'coalesce',
    ['get', 'user_color'],
    ['get', 'user_layerColor'],
    'null',
  ],
  'fill-opacity': 0.25,
};

const haloPaint = {
  'circle-color': '#fff',
  'circle-radius': 16,
  'circle-opacity': 0.5,
};

const outlinePaint = {
  'line-color': '#fff',
  'line-width': 4,
  'line-opacity': 0.5,
  'line-gap-width': 3,
};

const vertexPaint = {
  'circle-color': '#fff',
  'circle-radius': 4,
};

const midpointPaint = {
  'circle-color': [
    'coalesce',
    ['get', 'user_color'],
    ['get', 'user_layerColor'],
    'null',
  ],
  'circle-radius': 3,
};

export const mapboxDrawStyles = [
  /**
   * POINT
   */
  // point
  {
    id: 'point',
    type: 'symbol',
    filter: [
      'all',
      ['==', '$type', GeometryTypeNames.Point],
      ['==', 'meta', 'feature'],
      ['==', 'active', 'false'],
    ],
    layout: pointLayout,
    paint: pointPaint,
  },
  // point halo - active
  {
    id: 'point-halo_active',
    type: 'circle',
    filter: [
      'all',
      ['==', '$type', GeometryTypeNames.Point],
      ['==', 'meta', 'feature'],
      ['==', 'active', 'true'],
    ],
    paint: haloPaint,
  },
  // point - active
  {
    id: 'point_active',
    type: 'symbol',
    filter: [
      'all',
      ['==', '$type', GeometryTypeNames.Point],
      ['==', 'meta', 'feature'],
      ['==', 'active', 'true'],
    ],
    layout: pointLayout,
    paint: pointPaint,
  },
  /**
   * LINESTRING
   */
  // line
  {
    id: 'line',
    type: 'line',
    filter: [
      'all',
      ['==', '$type', GeometryTypeNames.LineString],
      ['==', 'active', 'false'],
    ],
    layout: lineLayout,
    paint: linePaint,
  },
  // line halo - active
  {
    id: 'line-halo_active',
    type: 'line',
    filter: [
      'all',
      ['==', '$type', GeometryTypeNames.LineString],
      ['==', 'active', 'true'],
    ],
    layout: lineLayout,
    paint: outlinePaint,
  },
  // line - active
  {
    id: 'line_active',
    type: 'line',
    filter: [
      'all',
      ['==', '$type', GeometryTypeNames.LineString],
      ['==', 'active', 'true'],
    ],
    layout: lineLayout,
    paint: linePaint,
  },
  /**
   * POLYGON
   */
  // polygon outline
  {
    id: 'polygon-outline',
    type: 'line',
    filter: [
      'all',
      ['==', '$type', GeometryTypeNames.Polygon],
      ['==', 'active', 'false'],
    ],
    layout: lineLayout,
    paint: linePaint,
  },
  // polygon fill
  {
    id: 'polygon-fill',
    type: 'fill',
    filter: [
      'all',
      ['==', '$type', GeometryTypeNames.Polygon],
      ['==', 'active', 'false'],
    ],
    layout: polygonLayout,
    paint: polygonPaint,
  },
  // polygon outline halo - active
  {
    id: 'polygon-outline-halo_active',
    type: 'line',
    filter: [
      'all',
      ['==', '$type', GeometryTypeNames.Polygon],
      ['==', 'active', 'true'],
    ],
    layout: lineLayout,
    paint: outlinePaint,
  },
  // polygon outline - active
  {
    id: 'polygon-outline_active',
    type: 'line',
    filter: [
      'all',
      ['==', '$type', GeometryTypeNames.Polygon],
      ['==', 'active', 'true'],
    ],
    layout: lineLayout,
    paint: linePaint,
  },
  // polygon fill - active
  {
    id: 'polygon-fill_active',
    type: 'fill',
    filter: [
      'all',
      ['==', '$type', GeometryTypeNames.Polygon],
      ['==', 'active', 'true'],
    ],
    layout: polygonLayout,
    paint: polygonPaint,
  },
  /**
   * MULTI-STATE
   */
  // line + polygon mid points - active
  {
    id: 'line-and-polygon-mid-point_active',
    type: 'circle',
    filter: [
      'all',
      ['==', '$type', GeometryTypeNames.Point],
      ['==', 'meta', 'midpoint'],
    ],
    paint: midpointPaint,
  },
  // line + polygon vertex point halos - active
  {
    id: 'line-and-polygon-vertex-halo_active',
    type: 'circle',
    filter: [
      'all',
      ['==', 'meta', 'vertex'],
      ['==', '$type', GeometryTypeNames.Point],
      ['!=', 'mode', 'static'],
    ],
    paint: vertexPaint,
  },
  // line + polygon vertex points - active
  {
    id: 'line-and-polygon-vertex_active',
    type: 'circle',
    filter: [
      'all',
      ['==', 'meta', 'vertex'],
      ['==', '$type', GeometryTypeNames.Point],
      ['!=', 'mode', 'static'],
    ],
    paint: midpointPaint,
  },
];
