import cloneDeep from 'lodash.clonedeep';
import get from 'lodash.get';

const recursiveFilter = (
  obj: Record<string, any>,
  filter: string,
  depth: number
) => {
  const prop = filter
    .split('.')
    .slice(depth, depth + 1)
    .join('.');

  if (!prop) return;

  //iterate the object
  for (const key in obj) {
    if (key !== prop) {
      delete obj[key];
    }

    recursiveFilter(obj[key], filter, depth + 1);
  }
};

export const filterPropertiesViaDotNotation = (
  obj: Record<string, any>,
  filter: string
): object | null => {
  if (!get(obj, filter)) return null;

  const clonedObj = cloneDeep(obj);

  const depth = 0;

  recursiveFilter(clonedObj, filter, depth);

  return clonedObj;
};
