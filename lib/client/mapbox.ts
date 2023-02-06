import mapboxgl from 'mapbox-gl';

const mapboxGlAccessToken = process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN;

if (mapboxGlAccessToken) {
  mapboxgl.accessToken = mapboxGlAccessToken;
} else {
  throw Error('Mapbox access token is not defined');
}

export { mapboxgl };
