export const getJson = async (res: Response): Promise<any | null> => {
  const contentType: string = res.headers.get('content-type') || '';

  const isJson = contentType.includes('application/json');
  const isGeoJson = contentType.includes('application/vnd.geo+json');

  return isJson || isGeoJson ? await res.json() : null;
};
