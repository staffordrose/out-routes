import curry from 'lodash.curry';
// import get from 'lodash.get';
import isEmpty from 'lodash.isempty';
import pick from 'lodash.pick';
import { nanoid } from 'nanoid';

import { RouteActions, routeActions } from '@/data/routes';
import { RouteCommitItem } from '@/types/commits';
import { PartialRoute, Route } from '@/types/routes';
// import { filterPropertiesViaDotNotation } from '../../data-structures';
import { arePropertiesEqual, hasProperty, PropertyTypes } from './helpers';

export const compareRoutes = (
  prev: PartialRoute | undefined,
  next: PartialRoute | undefined
): RouteCommitItem[] => {
  const commitItems: RouteCommitItem[] = [];

  const addRouteProperty = addRoutePropertyCurried({ commitItems, prev, next });
  const removeRouteProperty = removeRoutePropertyCurried({
    commitItems,
    prev,
    next,
  });
  const updateRouteProperty = updateRoutePropertyCurried({
    commitItems,
    prev,
    next,
  });
  // const updateNestedRouteProperty = updateNestedRoutePropertyCurried({
  //   commitItems,
  //   prev,
  //   next,
  // });

  // owner

  /**
   * TODO: When owner transfers route to new owner,
   * manually add the `prev` and `next` owner info in the function
   * instead of comparing owner ids here
   *
   * Handle it like the fork_route action
   */
  // updateNestedRouteProperty({
  //   property: 'owner.id',
  //   action: 'update_owner',
  // });

  // is_private

  addRouteProperty({
    property: 'is_private',
    type: 'boolean',
    action: 'add_is_private',
  });

  updateRouteProperty({
    property: 'is_private',
    type: 'boolean',
    action: 'update_is_private',
  });

  // slug

  updateRouteProperty({
    property: 'slug',
    action: 'update_slug',
  });

  // title

  addRouteProperty({
    property: 'title',
    action: 'add_title',
  });

  updateRouteProperty({
    property: 'title',
    action: 'update_title',
  });

  // title_alt

  addRouteProperty({
    property: 'title_alt',
    type: 'array',
    action: 'add_title_alt',
  });

  updateRouteProperty({
    property: 'title_alt',
    type: 'array',
    action: 'update_title_alt',
  });

  removeRouteProperty({
    property: 'title_alt',
    type: 'array',
    action: 'remove_title_alt',
  });

  // activity_type

  addRouteProperty({
    property: 'activity_type',
    action: 'add_activity_type',
  });

  updateRouteProperty({
    property: 'activity_type',
    action: 'update_activity_type',
  });

  // region

  addRouteProperty({
    property: 'region',
    action: 'add_region',
  });

  updateRouteProperty({
    property: 'region',
    action: 'update_region',
  });

  removeRouteProperty({
    property: 'region',
    action: 'remove_region',
  });

  // country

  addRouteProperty({
    property: 'country',
    action: 'add_country',
  });

  updateRouteProperty({
    property: 'country',
    action: 'update_country',
  });

  removeRouteProperty({
    property: 'country',
    action: 'remove_country',
  });

  // summary

  addRouteProperty({
    property: 'summary',
    action: 'add_summary',
  });

  updateRouteProperty({
    property: 'summary',
    action: 'update_summary',
  });

  removeRouteProperty({
    property: 'summary',
    action: 'remove_summary',
  });

  // image_id

  addRouteProperty({
    property: 'image_id',
    additionalProperties: [
      'image_full',
      'image_og',
      'image_banner',
      'image_card_banner',
      'image_thumb_360',
      'image_thumb_240',
      'image_thumb_120',
    ],
    action: 'add_route_image',
  });

  updateRouteProperty({
    property: 'image_id',
    additionalProperties: [
      'image_full',
      'image_og',
      'image_banner',
      'image_card_banner',
      'image_thumb_360',
      'image_thumb_240',
      'image_thumb_120',
    ],
    action: 'update_route_image',
  });

  removeRouteProperty({
    property: 'image_id',
    additionalProperties: [
      'image_full',
      'image_og',
      'image_banner',
      'image_card_banner',
      'image_thumb_360',
      'image_thumb_240',
      'image_thumb_120',
    ],
    action: 'remove_route_image',
  });

  return commitItems;
};

type SharedArgs = {
  commitItems: RouteCommitItem[];
  prev?: PartialRoute;
  next?: PartialRoute;
};

type ChangeRouteProperty = {
  type?: `${PropertyTypes}`;
  action: `${RouteActions}`;
};

type AdditionalProperty = keyof Omit<Route, 'id' | 'is_private'>;

type AddRemoveRouteProperty = ChangeRouteProperty &
  (
    | {
        property: keyof Route;
        additionalProperties?: AdditionalProperty[];
      }
    | {
        property?: never;
        additionalProperties?: never;
      }
  );

// add property
const addRoutePropertyBase = (
  { commitItems, prev, next }: SharedArgs,
  {
    property,
    additionalProperties,
    type = 'string',
    action,
  }: AddRemoveRouteProperty
) => {
  if (property) {
    if (
      (!prev || !hasProperty(prev[property], type)) &&
      next &&
      hasProperty(next[property], type)
    ) {
      commitItems.push({
        id: nanoid(),
        action: routeActions[action],
        payload: {
          next: {
            id: next.id,
            is_private: next.is_private,
            [property]: next[property],
            ...(Array.isArray(additionalProperties) &&
            additionalProperties.length
              ? pick(next, additionalProperties)
              : {}),
          },
        },
        resource_id: next.id,
        resource_table: 'routes',
      });
    }
  } else {
    if ((!prev || isEmpty(prev)) && next && !isEmpty(next)) {
      commitItems.push({
        id: nanoid(),
        action: routeActions[action],
        payload: { next },
        resource_id: next.id,
        resource_table: 'routes',
      });
    }
  }
};

const addRoutePropertyCurried = curry(addRoutePropertyBase);

// remove property
const removeRoutePropertyBase = (
  { commitItems, prev, next }: SharedArgs,
  {
    property,
    additionalProperties,
    type = 'string',
    action,
  }: AddRemoveRouteProperty
) => {
  if (property) {
    if (
      prev &&
      hasProperty(prev[property], type) &&
      (!next || !hasProperty(next[property], type))
    ) {
      commitItems.push({
        id: nanoid(),
        action: routeActions[action],
        payload: {
          prev: {
            id: prev.id,
            is_private: prev.is_private,
            [property]: prev[property],
            ...(Array.isArray(additionalProperties) &&
            additionalProperties.length
              ? pick(prev, additionalProperties)
              : {}),
          },
        },
        resource_id: prev.id,
        resource_table: 'routes',
      });
    }
  } else {
    if (prev && !isEmpty(prev) && (!next || isEmpty(next))) {
      commitItems.push({
        id: nanoid(),
        action: routeActions[action],
        payload: { prev },
        resource_id: prev.id,
        resource_table: 'routes',
      });
    }
  }
};

const removeRoutePropertyCurried = curry(removeRoutePropertyBase);

// update property
type UpdateRouteProperty = ChangeRouteProperty & {
  property: keyof Route;
  additionalProperties?: AdditionalProperty[];
};

const updateRoutePropertyBase = (
  { commitItems, prev, next }: SharedArgs,
  {
    property,
    additionalProperties,
    type = 'string',
    action,
  }: UpdateRouteProperty
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
      action: routeActions[action],
      payload: {
        prev: {
          id: prev.id,
          is_private: prev.is_private,
          [property]: prev[property],
          ...(Array.isArray(additionalProperties) && additionalProperties.length
            ? pick(prev, additionalProperties)
            : {}),
        },
        next: {
          id: next.id,
          is_private: next.is_private,
          [property]: next[property],
          ...(Array.isArray(additionalProperties) && additionalProperties.length
            ? pick(next, additionalProperties)
            : {}),
        },
      },
      resource_id: next.id,
      resource_table: 'routes',
    });
  }
};

const updateRoutePropertyCurried = curry(updateRoutePropertyBase);

// update nested property
// type UpdateNestedRouteProperty = ChangeRouteProperty & {
//   property: string;
// };

// const updateNestedRoutePropertyBase = (
//   { commitItems, prev, next }: SharedArgs,
//   { property, type = 'string', action }: UpdateNestedRouteProperty
// ) => {
//   if (
//     prev &&
//     hasProperty(get(prev, property), type) &&
//     next &&
//     hasProperty(get(next, property), type) &&
//     !arePropertiesEqual(get(prev, property), get(next, property), type)
//   ) {
//     commitItems.push({
//       id: nanoid(),
//       action: routeActions[action],
//       payload: {
//         prev: {
//           id: prev.id,
//           is_private: prev.is_private,
//           ...(filterPropertiesViaDotNotation(prev, property) || {}),
//         },
//         next: {
//           id: next.id,
//           is_private: next.is_private,
//           ...(filterPropertiesViaDotNotation(next, property) || {}),
//         },
//       },
//       resource_id: next.id,
//       resource_table: 'routes',
//     });
//   }
// };

// const updateNestedRoutePropertyCurried = curry(updateNestedRoutePropertyBase);
