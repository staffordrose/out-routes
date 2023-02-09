import { FC } from 'react';

import { routeActions } from '@/data/routes';
import { RouteCommitItem as RouteCommitItemT } from '@/types';
import { ActivityType, Country, Image, Quotes, TitleAlt } from './properties';
import { CommitItem } from './shared';

// TODO: Move fork_route out of RouteCommitItem and make it into its own this (like settings or administration)
export const RouteCommitItem: FC<RouteCommitItemT> = ({
  action,
  payload: { prev, next },
}) => {
  switch (action) {
    case routeActions.fork_route:
    // TODO: Fix appearance of fork_route
    // TODO: This commit item expects { route, layers, features } in prev,
    // but type is route
    // return (
    //   <CommitItem
    //     type='add'
    //     name='Fork Route
    //     nextChildren={`Forked from @${prev?.route?.owner.username}/${prev?.route?.slug}`}
    //   />
    // );
    case routeActions.update_owner:
      return (
        <CommitItem
          type='update'
          name='Owner'
          prevChildren={prev?.owner?.username}
          nextChildren={next?.owner?.username}
        />
      );
    case routeActions.add_is_private:
      return (
        <CommitItem
          type='add'
          name='Visibility'
          nextChildren={next?.is_private ? 'Private' : 'Public'}
        />
      );
    case routeActions.update_is_private:
      return (
        <CommitItem
          type='update'
          name='Visibility'
          prevChildren={prev?.is_private ? 'Private' : 'Public'}
          nextChildren={next?.is_private ? 'Private' : 'Public'}
        />
      );
    case routeActions.update_slug:
      return (
        <CommitItem
          type='update'
          name='Slug'
          prevChildren={<Quotes text={prev?.slug} />}
          nextChildren={<Quotes text={next?.slug} />}
        />
      );
    case routeActions.add_title:
      return (
        <CommitItem
          type='add'
          name='Title'
          nextChildren={<Quotes text={next?.title} />}
        />
      );
    case routeActions.update_title:
      return (
        <CommitItem
          type='update'
          name='Title'
          prevChildren={<Quotes text={prev?.title} />}
          nextChildren={<Quotes text={next?.title} />}
        />
      );
    case routeActions.add_title_alt:
      return (
        <CommitItem
          type='add'
          name='Alternate Names'
          nextChildren={<TitleAlt title_alt={next?.title_alt} />}
        />
      );
    case routeActions.update_title_alt:
      return (
        <CommitItem
          type='update'
          name='Alternate Names'
          prevChildren={<TitleAlt title_alt={prev?.title_alt} />}
          nextChildren={<TitleAlt title_alt={next?.title_alt} />}
        />
      );
    case routeActions.remove_title_alt:
      return (
        <CommitItem
          type='remove'
          name='Alternate Names'
          prevChildren={<TitleAlt title_alt={prev?.title_alt} />}
        />
      );
    case routeActions.add_activity_type:
      return (
        <CommitItem
          type='add'
          name='Activity'
          nextChildren={<ActivityType activity_type={next?.activity_type} />}
        />
      );
    case routeActions.update_activity_type:
      return (
        <CommitItem
          type='update'
          name='Activity'
          prevChildren={<ActivityType activity_type={prev?.activity_type} />}
          nextChildren={<ActivityType activity_type={next?.activity_type} />}
        />
      );
    case routeActions.add_region:
      return (
        <CommitItem
          type='add'
          name='Region'
          nextChildren={<Quotes text={next?.region} />}
        />
      );
    case routeActions.update_region:
      return (
        <CommitItem
          type='update'
          name='Region'
          prevChildren={<Quotes text={prev?.region} />}
          nextChildren={<Quotes text={next?.region} />}
        />
      );
    case routeActions.remove_region:
      return (
        <CommitItem
          type='remove'
          name='Region'
          prevChildren={<Quotes text={prev?.region} />}
        />
      );
    case routeActions.add_country:
      return (
        <CommitItem
          type='add'
          name='Country'
          nextChildren={<Country country={next?.country} />}
        />
      );
    case routeActions.update_country:
      return (
        <CommitItem
          type='update'
          name='Country'
          prevChildren={<Country country={prev?.country} />}
          nextChildren={<Country country={next?.country} />}
        />
      );
    case routeActions.remove_country:
      return (
        <CommitItem
          type='remove'
          name='Country'
          prevChildren={<Country country={prev?.country} />}
        />
      );
    case routeActions.add_route_image:
      return (
        <CommitItem
          type='add'
          name='Image'
          nextChildren={
            <Image src={next?.image_thumb_240} alt='New route image' />
          }
        />
      );
    case routeActions.update_route_image:
      return (
        <CommitItem
          type='update'
          name='Image'
          prevChildren={
            <Image src={prev?.image_thumb_240} alt='Old route image' />
          }
          nextChildren={
            <Image src={next?.image_thumb_240} alt='New route image' />
          }
        />
      );
    case routeActions.remove_route_image:
      return (
        <CommitItem
          type='remove'
          name='Image'
          prevChildren={
            <Image src={prev?.image_thumb_240} alt='Old route image' />
          }
        />
      );
    default:
      return null;
  }
};
