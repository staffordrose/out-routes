import curry from 'lodash.curry';
import get from 'lodash.get';
import isEmpty from 'lodash.isempty';
import pick from 'lodash.pick';
import { nanoid } from 'nanoid';

import { RouteFeatureActions, routeFeatureActions } from '@/data/routes';
import {
  PartialRouteFeature,
  RouteFeature,
  RouteFeatureCommitItem,
} from '@/types';
import { filterPropertiesViaDotNotation } from '../../data-structures';
import { arePropertiesEqual, hasProperty, PropertyTypes } from './helpers';

export const compareRouteFeatures = (
  prev: PartialRouteFeature | undefined,
  next: PartialRouteFeature | undefined
): RouteFeatureCommitItem[] => {
  const commitItems: RouteFeatureCommitItem[] = [];

  const addRouteFeatureProperty = addRouteFeaturePropertyCurried({
    commitItems,
    prev,
    next,
  });
  const removeRouteFeatureProperty = removeRouteFeaturePropertyCurried({
    commitItems,
    prev,
    next,
  });
  const updateRouteFeatureProperty = updateRouteFeaturePropertyCurried({
    commitItems,
    prev,
    next,
  });
  const updateNestedRouteFeatureProperty =
    updateNestedRouteFeaturePropertyCurried({
      commitItems,
      prev,
      next,
    });

  // feature

  addRouteFeatureProperty({
    action: 'add_route_feature',
  });

  removeRouteFeatureProperty({
    action: 'remove_route_feature',
  });

  // return early
  if (commitItems.length) {
    return commitItems;
  }

  // layer

  updateNestedRouteFeatureProperty({
    property: 'layer.id',
    action: 'update_feature_layer',
  });

  // order

  updateRouteFeatureProperty({
    property: 'order',
    type: 'number',
    action: 'update_feature_order',
  });

  // type

  updateRouteFeatureProperty({
    property: 'type',
    action: 'update_feature_type',
  });

  // coordinates

  addRouteFeatureProperty({
    property: 'coordinates',
    action: 'add_feature_coordinates',
  });

  updateRouteFeatureProperty({
    property: 'coordinates',
    action: 'update_feature_coordinates',
  });

  removeRouteFeatureProperty({
    property: 'coordinates',
    action: 'remove_feature_coordinates',
  });

  // title

  addRouteFeatureProperty({
    property: 'title',
    action: 'add_feature_title',
  });

  updateRouteFeatureProperty({
    property: 'title',
    action: 'update_feature_title',
  });

  removeRouteFeatureProperty({
    property: 'title',
    action: 'remove_feature_title',
  });

  // color

  addRouteFeatureProperty({
    property: 'color',
    action: 'add_feature_color',
  });

  updateRouteFeatureProperty({
    property: 'color',
    action: 'update_feature_color',
  });

  removeRouteFeatureProperty({
    property: 'color',
    action: 'remove_feature_color',
  });

  // symbol

  addRouteFeatureProperty({
    property: 'symbol',
    action: 'add_feature_symbol',
  });

  updateRouteFeatureProperty({
    property: 'symbol',
    action: 'update_feature_symbol',
  });

  removeRouteFeatureProperty({
    property: 'symbol',
    action: 'remove_feature_symbol',
  });

  // description

  addRouteFeatureProperty({
    property: 'description',
    action: 'add_feature_description',
  });

  updateRouteFeatureProperty({
    property: 'description',
    action: 'update_feature_description',
  });

  removeRouteFeatureProperty({
    property: 'description',
    action: 'remove_feature_description',
  });

  // ele_start

  addRouteFeatureProperty({
    property: 'ele_start',
    type: 'number',
    action: 'add_feature_ele_start',
  });

  updateRouteFeatureProperty({
    property: 'ele_start',
    type: 'number',
    action: 'update_feature_ele_start',
  });

  removeRouteFeatureProperty({
    property: 'ele_start',
    type: 'number',
    action: 'remove_feature_ele_start',
  });

  // ele_end

  addRouteFeatureProperty({
    property: 'ele_end',
    type: 'number',
    action: 'add_feature_ele_end',
  });

  updateRouteFeatureProperty({
    property: 'ele_end',
    type: 'number',
    action: 'update_feature_ele_end',
  });

  removeRouteFeatureProperty({
    property: 'ele_end',
    type: 'number',
    action: 'remove_feature_ele_end',
  });

  // distance

  addRouteFeatureProperty({
    property: 'distance',
    type: 'number',
    action: 'add_feature_distance',
  });

  updateRouteFeatureProperty({
    property: 'distance',
    type: 'number',
    action: 'update_feature_distance',
  });

  removeRouteFeatureProperty({
    property: 'distance',
    type: 'number',
    action: 'remove_feature_distance',
  });

  // area

  addRouteFeatureProperty({
    property: 'area',
    type: 'number',
    action: 'add_feature_area',
  });

  updateRouteFeatureProperty({
    property: 'area',
    type: 'number',
    action: 'update_feature_area',
  });

  removeRouteFeatureProperty({
    property: 'area',
    type: 'number',
    action: 'remove_feature_area',
  });

  // image_id

  addRouteFeatureProperty({
    property: 'image_id',
    additionalProperties: [
      'image_full',
      'image_large',
      'image_card_banner',
      'image_thumb_360',
      'image_thumb_240',
      'image_thumb_120',
    ],
    action: 'add_feature_image',
  });

  updateRouteFeatureProperty({
    property: 'image_id',
    additionalProperties: [
      'image_full',
      'image_large',
      'image_card_banner',
      'image_thumb_360',
      'image_thumb_240',
      'image_thumb_120',
    ],
    action: 'update_feature_image',
  });

  removeRouteFeatureProperty({
    property: 'image_id',
    additionalProperties: [
      'image_full',
      'image_large',
      'image_card_banner',
      'image_thumb_360',
      'image_thumb_240',
      'image_thumb_120',
    ],
    action: 'remove_feature_image',
  });

  return commitItems;
};

type SharedArgs = {
  commitItems: RouteFeatureCommitItem[];
  prev?: PartialRouteFeature;
  next?: PartialRouteFeature;
};

type ChangeRouteFeatureProperty = {
  type?: `${PropertyTypes}`;
  action: `${RouteFeatureActions}`;
};

type AdditionalProperty = keyof Omit<RouteFeature, 'id'>;

type AddRemoveRouteFeatureProperty = ChangeRouteFeatureProperty &
  (
    | {
        property: keyof RouteFeature;
        additionalProperties?: AdditionalProperty[];
      }
    | {
        property?: never;
        additionalProperties?: never;
      }
  );

// add property
const addRouteFeaturePropertyBase = (
  { commitItems, prev, next }: SharedArgs,
  {
    property,
    additionalProperties,
    type = 'string',
    action,
  }: AddRemoveRouteFeatureProperty
) => {
  if (property) {
    if (
      (!prev || !hasProperty(prev[property], type)) &&
      next &&
      hasProperty(next[property], type)
    ) {
      commitItems.push({
        id: nanoid(),
        action: routeFeatureActions[action],
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
        resource_table: 'route_features',
      });
    }
  } else {
    if ((!prev || isEmpty(prev)) && next && !isEmpty(next)) {
      commitItems.push({
        id: nanoid(),
        action: routeFeatureActions[action],
        payload: { next },
        resource_id: next.id,
        resource_table: 'route_features',
      });
    }
  }
};

const addRouteFeaturePropertyCurried = curry(addRouteFeaturePropertyBase);

// remove property
const removeRouteFeaturePropertyBase = (
  { commitItems, prev, next }: SharedArgs,
  {
    property,
    additionalProperties,
    type = 'string',
    action,
  }: AddRemoveRouteFeatureProperty
) => {
  if (property) {
    if (
      prev &&
      hasProperty(prev[property], type) &&
      (!next || !hasProperty(next[property], type))
    ) {
      commitItems.push({
        id: nanoid(),
        action: routeFeatureActions[action],
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
        resource_table: 'route_features',
      });
    }
  } else {
    if (prev && !isEmpty(prev) && (!next || isEmpty(next))) {
      commitItems.push({
        id: nanoid(),
        action: routeFeatureActions[action],
        payload: { prev },
        resource_id: prev.id,
        resource_table: 'route_features',
      });
    }
  }
};

const removeRouteFeaturePropertyCurried = curry(removeRouteFeaturePropertyBase);

// update property
type UpdateRouteFeatureProperty = ChangeRouteFeatureProperty & {
  property: keyof RouteFeature;
  additionalProperties?: AdditionalProperty[];
};

const updateRouteFeaturePropertyBase = (
  { commitItems, prev, next }: SharedArgs,
  {
    property,
    additionalProperties,
    type = 'string',
    action,
  }: UpdateRouteFeatureProperty
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
      action: routeFeatureActions[action],
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
      resource_table: 'route_features',
    });
  }
};

const updateRouteFeaturePropertyCurried = curry(updateRouteFeaturePropertyBase);

// update nested property
type UpdateNestedRouteFeatureProperty = ChangeRouteFeatureProperty & {
  property: string;
};

const updateNestedRouteFeaturePropertyBase = (
  { commitItems, prev, next }: SharedArgs,
  { property, type = 'string', action }: UpdateNestedRouteFeatureProperty
) => {
  if (
    prev &&
    hasProperty(get(prev, property), type) &&
    next &&
    hasProperty(get(next, property), type) &&
    !arePropertiesEqual(get(prev, property), get(next, property), type)
  ) {
    commitItems.push({
      id: nanoid(),
      action: routeFeatureActions[action],
      payload: {
        prev: {
          id: prev.id,
          ...(filterPropertiesViaDotNotation(prev, property) || {}),
        },
        next: {
          id: next.id,
          ...(filterPropertiesViaDotNotation(next, property) || {}),
        },
      },
      resource_id: next.id,
      resource_table: 'route_features',
    });
  }
};

const updateNestedRouteFeaturePropertyCurried = curry(
  updateNestedRouteFeaturePropertyBase
);
