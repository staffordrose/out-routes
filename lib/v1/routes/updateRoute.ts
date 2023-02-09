import safeJsonStringify from 'safe-json-stringify';

import { ActivityActions } from '@/data/activity';
import {
  GeometryTypes,
  routeFeatureActions,
  routeLayerActions,
} from '@/data/routes';
import {
  Commit,
  PartialRouteLayersFeatures,
  Pull,
  Route,
  RouteFeatureCommitItem,
  RouteLayersFeatures,
  User,
} from '@/types';
import { compareCommits, sanitizeAndEscape, StatusError } from '@/utils';
import { getXataClient } from '@/xata';
import { deleteFeatureImage } from '../uploads';
import { addActivityRecords } from '../user';
import { getRouteByUsernameSlug } from './getRouteByUsernameSlug';

export const updateRoute = async (
  authUser: Pick<User, 'id'> & Partial<User>,
  username: User['username'],
  slug: Route['slug'],
  {
    pullId,
    pullTitle,
    commitTitle,
    values,
  }: {
    pullId?: Pull['id'];
    pullTitle?: Pull['title'];
    commitTitle?: Commit['title'];
    values: RouteLayersFeatures;
  }
): Promise<Route> => {
  try {
    // username is missing
    if (!username) {
      throw new StatusError(
        400,
        `A valid username is required to update a route`
      );
    }

    // slug is missing
    if (!slug) {
      throw new StatusError(400, `A route slug is required to update a route`);
    }

    // route, layers, and features
    const base = await getRouteByUsernameSlug(username, slug);

    // route does not exist
    if (!base?.route?.id) {
      throw new StatusError(
        404,
        `A route does not exist for the provided username and slug`
      );
    }

    // get changes as commit items
    const commitItems = compareCommits(
      base.route.updated_at
        ? base
        : ({
            route: {
              ...base.route,
              // when adding a new route, prevent `is_private` from being defined in base route
              is_private: undefined as unknown as Route['is_private'],
            },
            layers: base.layers,
            features: base.features,
          } as PartialRouteLayersFeatures),
      values as PartialRouteLayersFeatures
    );

    const xata = getXataClient();

    // add route commit
    const route_commit = await xata.db.route_commits.create({
      created_at: new Date(),
      parent_id: base.route.commit_id,
      route: base.route.id,
      user: authUser.id,
      pull_id: pullId || null,
      title:
        sanitizeAndEscape(commitTitle || '') ||
        sanitizeAndEscape(pullTitle || '') ||
        null,
    });

    if (!route_commit) {
      throw new StatusError(
        400,
        `Something went wrong attempting to create a new history commit`
      );
    }

    const routeCommitItemPromises = commitItems.map(
      ({ action, payload, resource_id, resource_table }) =>
        xata.db.route_commit_items.create({
          created_at: new Date(),
          commit: route_commit.id,
          action,
          payload: safeJsonStringify(payload),
          resource_id,
          resource_table,
        })
    );

    await Promise.all(routeCommitItemPromises);

    // add/update layers
    const createOrUpdateLayersPromiseArray = (values.layers || []).map(
      (layer) => {
        const sharedProperties = {
          updated_at: new Date(),
          route: layer.route?.id,
          order:
            Number(layer.order) === 0
              ? 0
              : Number(layer.order) || values.layers?.length || 0,
          title: sanitizeAndEscape(layer.title || ''),
          color: layer.color,
          symbol: layer.symbol,
        };

        if (!layer.id) {
          return xata.db.route_layers.create({
            created_at: new Date(),
            ...sharedProperties,
          });
        } else {
          return xata.db.route_layers.createOrUpdate(layer.id, {
            created_at: layer.created_at || new Date(),
            ...sharedProperties,
          });
        }
      }
    );

    // delete layers
    const deleteLayersPromiseArray = commitItems
      .filter(
        ({ action, payload }) =>
          action === routeLayerActions.remove_route_layer && payload?.prev?.id
      )
      .map(({ payload: { prev } }) =>
        prev?.id ? xata.db.route_layers.delete(prev.id) : undefined
      );

    if (
      createOrUpdateLayersPromiseArray.length ||
      deleteLayersPromiseArray.length
    ) {
      await Promise.all([
        ...createOrUpdateLayersPromiseArray,
        ...deleteLayersPromiseArray,
      ]);
    }

    // add/update features
    const createOrUpdateFeaturesPromiseArray = (values.features || []).map(
      (feature) => {
        const type = feature.type;

        const sharedProperties = {
          updated_at: new Date(),
          route: feature.route?.id,
          layer: feature.layer?.id,
          order:
            Number(feature.order) === 0
              ? 0
              : Number(feature.order) || values.features?.length || 0,
          type,
          coordinates: feature.coordinates,
          title: sanitizeAndEscape(feature.title || ''),
          color: feature.color,
          symbol: feature.symbol,
          description: sanitizeAndEscape(feature.description || ''),
          ele_start: [GeometryTypes.Point, GeometryTypes.LineString].includes(
            type as GeometryTypes
          )
            ? Number(feature.ele_start) || 0
            : null,
          ele_end:
            type === GeometryTypes.LineString
              ? Number(feature.ele_end) || 0
              : null,
          distance:
            type === GeometryTypes.LineString
              ? Number(feature.distance) || 0
              : null,
          area:
            type === GeometryTypes.Polygon ? Number(feature.area) || 0 : null,
          image_id: feature.image_id,
          image_full: feature.image_full,
          image_large: feature.image_large,
          image_card_banner: feature.image_card_banner,
          image_thumb_360: feature.image_thumb_360,
          image_thumb_240: feature.image_thumb_240,
          image_thumb_120: feature.image_thumb_120,
        };

        if (!feature.id) {
          return xata.db.route_features.create({
            created_at: new Date(),
            ...sharedProperties,
          });
        } else {
          return xata.db.route_features.createOrUpdate(feature.id, {
            created_at: feature.created_at || new Date(),
            ...sharedProperties,
          });
        }
      }
    );

    /**
     * TODO: Request all route commitItems and check for
     * `update_feature_image` and `remove_feature_image` actions for the
     * features that are being deleted
     */
    // delete features
    const removeFeatureCommitItems = commitItems.filter(
      ({ action, payload }) =>
        action === routeFeatureActions.remove_route_feature && payload?.prev?.id
    ) as RouteFeatureCommitItem[];

    const deleteFeaturesPromiseArray = removeFeatureCommitItems.map(
      async ({ payload: { prev } }) => {
        if (prev?.id) {
          // if feature images exist, delete them
          if (prev.image_id) {
            await deleteFeatureImage(prev.id, prev.image_id);
          }

          // delete feature
          await xata.db.route_features.delete(prev.id);
        }
      }
    );

    if (
      createOrUpdateFeaturesPromiseArray.length ||
      deleteFeaturesPromiseArray.length
    ) {
      await Promise.all([
        ...createOrUpdateFeaturesPromiseArray,
        ...deleteFeaturesPromiseArray,
      ]);
    }

    const {
      is_private,
      title,
      title_alt,
      activity_type,
      region,
      country,
      map_bounding_box,
      map_start_lng,
      map_start_lat,
      map_start_ele,
      map_end_lng,
      map_end_lat,
      map_end_ele,
      map_distance,
      image_id,
      image_full,
      image_og,
      image_banner,
      image_card_banner,
      image_thumb_360,
      image_thumb_240,
      image_thumb_120,
    } = values.route;

    // update route
    const route = await xata.db.routes.update(base.route.id, {
      updated_at: new Date(),
      commit_id: route_commit.id,
      is_private: Boolean(is_private),
      title: sanitizeAndEscape(title || ''),
      title_alt: Array.isArray(title_alt)
        ? title_alt.map((t) => sanitizeAndEscape(t || ''))
        : [],
      activity_type,
      region: sanitizeAndEscape(region || ''),
      country,
      map_bounding_box,
      map_start_lng: map_start_lng || null,
      map_start_lat: map_start_lat || null,
      map_start_ele: Number(map_start_ele) || 0,
      map_end_lng: map_end_lng || null,
      map_end_lat: map_end_lat || null,
      map_end_ele: Number(map_end_ele) || 0,
      map_distance: Number(map_distance) || 0,
      image_id,
      image_full,
      image_og,
      image_banner,
      image_card_banner,
      image_thumb_360,
      image_thumb_240,
      image_thumb_120,
      stats_layers: Array.isArray(values.layers) ? values.layers.length : 0,
      stats_features: Array.isArray(values.features)
        ? values.features.length
        : 0,
      stats_members: Number(base.route.stats_members) || 1,
      stats_commits: (Number(base.route.stats_commits) || 0) + 1,
      stats_forks: Number(base.route.stats_forks) || 0,
      stats_favorites: Number(base.route.stats_favorites) || 0,
    });

    if (!route) {
      throw new StatusError(
        400,
        `An unknown error occured when attempting to update the route`
      );
    }

    const existingContributor = await xata.db.route_contributors
      .filter({
        'route.id': route.id,
        'user.id': authUser.id,
      })
      .select(['*'])
      .getFirst();

    if (existingContributor) {
      // update auth user contributor record
      await existingContributor.update({
        contributed_at: new Date(),
        stats_contributions:
          (Number(existingContributor.stats_contributions) || 0) + 1,
      });
    } else {
      await Promise.all([
        // first contribution by auth user
        xata.db.route_contributors.create({
          created_at: new Date(),
          contributed_at: new Date(),
          route: route.id,
          user: authUser.id,
          stats_contributions: 1,
        }),
        // increment route contributor stats
        xata.db.routes.update(route.id, {
          stats_contributors: (Number(base.route.stats_contributors) || 0) + 1,
        }),
      ]);
    }

    await Promise.all([
      // update auth user stats
      xata.db.users.createOrUpdate(authUser.id, {
        stats_commits: (Number(authUser.stats_commits) || 0) + 1,
      }),
    ]);

    // TODO: If route is private, create activity records for route members
    if (!is_private) {
      const routeWithOwner = await xata.db.routes
        .filter('id', route.id)
        .select(['*', 'owner.username'])
        .getFirst();

      // create activity records
      addActivityRecords(authUser.id, {
        action: !base.route.updated_at
          ? ActivityActions.ADD_ROUTE
          : ActivityActions.UPDATE_ROUTE,
        payload: routeWithOwner as Route,
      });
    }

    return JSON.parse(safeJsonStringify(route));
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new StatusError(400, `Something went wrong updating the route`);
    }
  }
};
