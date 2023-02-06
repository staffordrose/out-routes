import { FC, useMemo } from 'react';
import dayjs from 'dayjs';

import { GridProps } from '@/components/atoms';
import { CardList } from '@/components/organisms';
import { monthLabels } from '@/data/general';
import { Follower, User } from '@/types';
import { UserCard, UserCardProps } from './UserCard';

type FollowersListProps = {
  followers: Follower[];
  authUser?: User;
  followingIds?: User['id'][];
  handleFollow: (user: Pick<User, 'username'>, isFollowing: boolean) => void;
  columns?: GridProps['columns'];
  cardOrientation: UserCardProps['orientation'];
};

export const FollowersList: FC<FollowersListProps> = ({
  followers,
  authUser,
  followingIds,
  handleFollow,
  columns,
  cardOrientation,
}) => {
  const followersGrouped = useMemo(
    () => groupByYearAndMonth(followers),
    [followers]
  );

  const isAuthenticated = !!authUser?.username;

  return (
    <>
      {followersGrouped.map(({ year, months }) => {
        if (!Array.isArray(months) || !months.length) return null;

        return (
          <CardList.Group key={year} title={year?.toString()} marginBottom='lg'>
            {months.map(({ month, followers }) => {
              if (!Array.isArray(followers) || !followers.length) return null;

              return (
                <CardList.Group
                  key={month}
                  title={monthLabels[month]}
                  titleAs='h4'
                >
                  <CardList.Grid columns={columns}>
                    {followers.map(({ follower }) => {
                      if (!follower) return null;

                      const {
                        id,
                        username,
                        name,
                        bio,
                        image_thumb_120,
                        stats_followers,
                      } = follower;

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
    followers: Follower[];
  }[];
}>;

const groupByYearAndMonth = (arr?: Follower[]): GroupedByYearMonth => {
  let year = dayjs().year();
  let month = dayjs().month();

  let copy: Follower[] = Array.from(arr || []);
  const grouped: GroupedByYearMonth = [];

  while (copy.length > 0) {
    const { followers, nextCopy } = copy.reduce(
      (accum, curr) => {
        const comparison = dayjs(curr.created_at);

        if (comparison.year() === year && comparison.month() === month) {
          accum.followers.push(curr);
        } else {
          accum.nextCopy.push(curr);
        }

        return accum;
      },
      {
        followers: [] as Follower[],
        nextCopy: [] as Follower[],
      }
    );

    const index = grouped.findIndex((g) => g.year === year);
    if (index !== -1) {
      grouped[index].months.push({ month, followers });
    } else {
      grouped.push({
        year,
        months: [
          {
            month,
            followers,
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
