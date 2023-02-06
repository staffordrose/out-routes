export const getJson = async (res: Response): Promise<any | null> => {
  const isJson = res.headers.get('content-type')?.includes('application/json');

  return isJson ? await res.json() : null;
};
