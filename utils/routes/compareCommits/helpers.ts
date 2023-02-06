import isEmpty from 'lodash.isempty';
import isEqual from 'lodash.isequal';

// possible property values
type PropertyValue = string | number | boolean | object | null | undefined;

// accepted property types
export enum PropertyTypes {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  ARRAY = 'array',
  OBJECT = 'object',
}

export const hasProperty = (
  value: PropertyValue,
  type: `${PropertyTypes}`
): boolean => {
  switch (type) {
    case 'string':
      return typeof value === 'string' && !!value;
    case 'number':
      return typeof value === 'number' && Number.isFinite(value);
    case 'boolean':
      return typeof value === 'boolean';
    case 'array':
      return Array.isArray(value) && !isEmpty(value);
    case 'object':
      return !Array.isArray(value) && !isEmpty(value);
    default:
      return false;
  }
};

export const arePropertiesEqual = (
  prevValue: PropertyValue,
  nextValue: PropertyValue,
  type: `${PropertyTypes}`
): boolean => {
  switch (type) {
    case 'string':
    case 'number':
    case 'boolean':
      return prevValue === nextValue;
    case 'array':
    case 'object':
    default:
      return isEqual(prevValue, nextValue);
  }
};
