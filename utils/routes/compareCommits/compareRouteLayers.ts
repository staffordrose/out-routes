import curry from 'lodash.curry';
import isEmpty from 'lodash.isempty';
import pick from 'lodash.pick';
import { nanoid } from 'nanoid';

import { RouteLayerActions, routeLayerActions } from '@/data/routes';
import { PartialRouteLayer, RouteLayer, RouteLayerCommitItem } from '@/types';
import { arePropertiesEqual, hasProperty, PropertyTypes } from './helpers';

export const compareRouteLayers = (
  prev: PartialRouteLayer | undefined,
  next: PartialRouteLayer | undefined
): RouteLayerCommitItem[] => {
  const commitItems: RouteLayerCommitItem[] = [];

  const addRouteLayerProperty = addRouteLayerPropertyCurried({
    commitItems,
    prev,
    next,
  });
  const removeRouteLayerProperty = removeRouteLayerPropertyCurried({
    commitItems,
    prev,
    next,
  });
  const updateRouteLayerProperty = updateRouteLayerPropertyCurried({
    commitItems,
    prev,
    next,
  });

  // layer

  addRouteLayerProperty({
    action: 'add_route_layer',
  });

  removeRouteLayerProperty({
    action: 'remove_route_layer',
  });

  // return early
  if (commitItems.length) {
    return commitItems;
  }

  // order

  updateRouteLayerProperty({
    property: 'order',
    type: 'number',
    action: 'update_layer_order',
  });

  // title

  addRouteLayerProperty({
    property: 'title',
    action: 'add_layer_title',
  });

  updateRouteLayerProperty({
    property: 'title',
    action: 'update_layer_title',
  });

  removeRouteLayerProperty({
    property: 'title',
    action: 'remove_layer_title',
  });

  // color

  addRouteLayerProperty({
    property: 'color',
    action: 'add_layer_color',
  });

  updateRouteLayerProperty({
    property: 'color',
    action: 'update_layer_color',
  });

  removeRouteLayerProperty({
    property: 'color',
    action: 'remove_layer_color',
  });

  // symbol

  addRouteLayerProperty({
    property: 'symbol',
    action: 'add_layer_symbol',
  });

  updateRouteLayerProperty({
    property: 'symbol',
    action: 'update_layer_symbol',
  });

  removeRouteLayerProperty({
    property: 'symbol',
    action: 'remove_layer_symbol',
  });

  return commitItems;
};

type SharedArgs = {
  commitItems: RouteLayerCommitItem[];
  prev?: PartialRouteLayer;
  next?: PartialRouteLayer;
};

type ChangeRouteLayerProperty = {
  type?: `${PropertyTypes}`;
  action: `${RouteLayerActions}`;
};

type AdditionalProperty = keyof Omit<RouteLayer, 'id'>;

type AddRemoveRouteLayerProperty = ChangeRouteLayerProperty &
  (
    | {
        property: keyof RouteLayer;
        additionalProperties?: AdditionalProperty[];
      }
    | {
        property?: never;
        additionalProperties?: never;
      }
  );

// add property
const addRouteLayerPropertyBase = (
  { commitItems, prev, next }: SharedArgs,
  {
    property,
    additionalProperties,
    type = 'string',
    action,
  }: AddRemoveRouteLayerProperty
) => {
  if (property) {
    if (
      (!prev || !hasProperty(prev[property], type)) &&
      next &&
      hasProperty(next[property], type)
    ) {
      commitItems.push({
        id: nanoid(),
        action: routeLayerActions[action],
        payload: {
          next: {
            id: next.id,
            [property]: next[property],
            ...(Array.isArray(additionalProperties) &&
            additionalProperties.length
              ? pick(next, additionalProperties)
              : {}),
          },
        },
        resource_id: next.id,
        resource_table: 'route_layers',
      });
    }
  } else {
    if ((!prev || isEmpty(prev)) && next && !isEmpty(next)) {
      commitItems.push({
        id: nanoid(),
        action: routeLayerActions[action],
        payload: { next },
        resource_id: next.id,
        resource_table: 'route_layers',
      });
    }
  }
};

const addRouteLayerPropertyCurried = curry(addRouteLayerPropertyBase);

// remove property
const removeRouteLayerPropertyBase = (
  { commitItems, prev, next }: SharedArgs,
  {
    property,
    additionalProperties,
    type = 'string',
    action,
  }: AddRemoveRouteLayerProperty
) => {
  if (property) {
    if (
      prev &&
      hasProperty(prev[property], type) &&
      (!next || !hasProperty(next[property], type))
    ) {
      commitItems.push({
        id: nanoid(),
        action: routeLayerActions[action],
        payload: {
          prev: {
            id: prev.id,
            [property]: prev[property],
            ...(Array.isArray(additionalProperties) &&
            additionalProperties.length
              ? pick(prev, additionalProperties)
              : {}),
          },
        },
        resource_id: prev.id,
        resource_table: 'route_layers',
      });
    }
  } else {
    if (prev && !isEmpty(prev) && (!next || isEmpty(next))) {
      commitItems.push({
        id: nanoid(),
        action: routeLayerActions[action],
        payload: { prev },
        resource_id: prev.id,
        resource_table: 'route_layers',
      });
    }
  }
};

const removeRouteLayerPropertyCurried = curry(removeRouteLayerPropertyBase);

// update property
type UpdateRouteLayerProperty = ChangeRouteLayerProperty & {
  property: keyof RouteLayer;
  additionalProperties?: AdditionalProperty[];
};

const updateRouteLayerPropertyBase = (
  { commitItems, prev, next }: SharedArgs,
  {
    property,
    additionalProperties,
    type = 'string',
    action,
  }: UpdateRouteLayerProperty
) => {
  if (
    prev &&
    hasProperty(prev[property], type) &&
    next &&
    hasProperty(next[property], type) &&
    !arePropertiesEqual(prev[property], next[property], type)
  ) {
    commitItems.push({
      id: nanoid(),
      action: routeLayerActions[action],
      payload: {
        prev: {
          id: prev.id,
          [property]: prev[property],
          ...(Array.isArray(additionalProperties) && additionalProperties.length
            ? pick(prev, additionalProperties)
            : {}),
        },
        next: {
          id: next.id,
          [property]: next[property],
          ...(Array.isArray(additionalProperties) && additionalProperties.length
            ? pick(next, additionalProperties)
            : {}),
        },
      },
      resource_id: next.id,
      resource_table: 'route_layers',
    });
  }
};

const updateRouteLayerPropertyCurried = curry(updateRouteLayerPropertyBase);
