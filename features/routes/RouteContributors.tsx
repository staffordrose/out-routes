import { FC } from 'react';
import { useQuery } from '@tanstack/react-query';

import { Avatar, Flex, IconButtonLink } from '@/components/atoms';
import { Feedback } from '@/components/layout';
import { HoverCard } from '@/components/molecules';
import { getRouteContributorsByUsernameSlug } from '@/lib/v1/api/routes';
import { PaginatedContributors } from '@/types/contributors';
import { Route } from '@/types/routes';
import { User } from '@/types/users';
import { UserCard } from '../users';

const QUERY_SIZE = 20;

type RouteContributorsProps = {
  username: User['username'];
  slug: Route['slug'];
};

export const RouteContributors: FC<RouteContributorsProps> = ({
  username,
  slug,
}) => {
  const contributorsQuery = useQuery({
    queryKey: ['contributors', username, slug, `size-${QUERY_SIZE}-page-1`],
    queryFn: (): Promise<PaginatedContributors> =>
      getRouteContributorsByUsernameSlug(username, slug, {
        size: QUERY_SIZE,
      }),
    staleTime: 300_000,
    enabled: !!username && !!slug,
  });

  const renderResult = () => {
    if (contributorsQuery.isLoading) {
      return <Feedback type='loading' title='Loading contributors' />;
    }
    if (contributorsQuery.isError) {
      return (
        <Feedback type='error' title='Something went wrong'>
          {contributorsQuery.error instanceof Error
            ? contributorsQuery.error.message
            : null}
        </Feedback>
      );
    }
    if (contributorsQuery.isSuccess) {
      const {
        data: { records: users },
      } = contributorsQuery;

      return (
        <Flex gap='sm'>
          {Array.isArray(users) &&
            users.length > 0 &&
            users.map(({ user }) => {
              if (!user) return null;

              const {
                id,
                username,
                name,
                image_thumb_120,
                image_thumb_32,
                stats_followers,
              } = user;

              return (
                <HoverCard
                  key={id}
                  card={
                    <UserCard
                      orientation='vertical'
                      image={image_thumb_120}
                      name={name}
                      username={username}
                      stats_followers={stats_followers}
                    />
                  }
                >
                  <IconButtonLink
                    variant='ghost'
                    size='sm'
                    borderRadius='full'
                    aria-label={`View ${name}'s profile`}
                    href={`/${username}`}
                  >
                    <Avatar
                      size='xs'
                      src={image_thumb_32 || undefined}
                      firstName={name?.split(' ')[0]}
                      lastName={name?.split(' ')[1]}
                    />
                  </IconButtonLink>
                </HoverCard>
              );
            })}
        </Flex>
      );
    }
    return (
      <Feedback type='empty' title='0 contributors'>
        The route does not have contributors
      </Feedback>
    );
  };

  return (
    <div>
      <h2>Contributors</h2>
      {renderResult()}
    </div>
  );
};
