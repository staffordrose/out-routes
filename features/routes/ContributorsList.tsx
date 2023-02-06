import { FC, useMemo } from 'react';
import dayjs from 'dayjs';

import { GridProps } from '@/components/atoms';
import { CardList } from '@/components/organisms';
import { monthLabels } from '@/data/general';
import { Contributor, User } from '@/types';
import { UserCard, UserCardProps } from '../users';

type ContributorsListProps = {
  contributors: Contributor[];
  authUser?: User;
  followingIds?: User['id'][];
  handleFollow: (user: Pick<User, 'username'>, isFollowing: boolean) => void;
  columns?: GridProps['columns'];
  cardOrientation: UserCardProps['orientation'];
};

export const ContributorsList: FC<ContributorsListProps> = ({
  contributors,
  authUser,
  followingIds,
  handleFollow,
  columns,
  cardOrientation,
}) => {
  const contributorsGrouped = useMemo(
    () => groupByYearAndMonth(contributors),
    [contributors]
  );

  const isAuthenticated = !!authUser?.username;

  return (
    <>
      {contributorsGrouped.map(({ year, months }) => {
        if (!Array.isArray(months) || !months.length) return null;

        return (
          <CardList.Group key={year} title={year?.toString()} marginBottom='lg'>
            {months.map(({ month, contributors }) => {
              if (!Array.isArray(contributors) || !contributors.length)
                return null;

              return (
                <CardList.Group
                  key={month}
                  title={monthLabels[month]}
                  titleAs='h4'
                >
                  <CardList.Grid columns={columns}>
                    {contributors.map(({ user }) => {
                      if (!user) return null;

                      const {
                        id,
                        username,
                        name,
                        bio,
                        image_thumb_120,
                        stats_followers,
                      } = user;

                      const authIsUser =
                        isAuthenticated && authUser.username === username;

                      const isFollowing = followingIds?.includes(id) || false;

                      return (
                        <UserCard
                          key={id}
                          orientation={cardOrientation}
                          image={image_thumb_120}
                          username={username}
                          name={name}
                          bio={bio}
                          stats_followers={stats_followers}
                          showFollowBtn={isAuthenticated && !authIsUser}
                          isFollowing={isFollowing}
                          handleFollow={() =>
                            handleFollow({ username }, isFollowing)
                          }
                        />
                      );
                    })}
                  </CardList.Grid>
                </CardList.Group>
              );
            })}
          </CardList.Group>
        );
      })}
    </>
  );
};

type GroupedByYearMonth = Array<{
  year: number;
  months: {
    month: number;
    contributors: Contributor[];
  }[];
}>;

const groupByYearAndMonth = (arr?: Contributor[]): GroupedByYearMonth => {
  let year = dayjs().year();
  let month = dayjs().month();

  let copy: Contributor[] = Array.from(arr || []);
  const grouped: GroupedByYearMonth = [];

  while (copy.length > 0) {
    const { contributors, nextCopy } = copy.reduce(
      (accum, curr) => {
        const comparison = dayjs(curr.created_at);

        if (comparison.year() === year && comparison.month() === month) {
          accum.contributors.push(curr);
        } else {
          accum.nextCopy.push(curr);
        }

        return accum;
      },
      {
        contributors: [] as Contributor[],
        nextCopy: [] as Contributor[],
      }
    );

    const index = grouped.findIndex((g) => g.year === year);
    if (index !== -1) {
      grouped[index].months.push({ month, contributors });
    } else {
      grouped.push({
        year,
        months: [
          {
            month,
            contributors,
          },
        ],
      });
    }

    copy = nextCopy;

    if (month > 0) {
      month--;
    } else {
      year--;
      month = 11;
    }
  }

  return grouped;
};
