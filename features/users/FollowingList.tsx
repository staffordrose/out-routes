import { FC, useMemo } from 'react';
import dayjs from 'dayjs';

import { GridProps } from '@/components/atoms';
import { CardList } from '@/components/organisms';
import { monthLabels } from '@/data/general';
import { Following } from '@/types/user-relationships';
import { User } from '@/types/users';
import { UserCard, UserCardProps } from './UserCard';

type FollowingListProps = {
  following: Following[];
  authUser?: User;
  followingIds?: User['id'][];
  handleFollow: (user: Pick<User, 'username'>, isFollowing: boolean) => void;
  columns?: GridProps['columns'];
  cardOrientation: UserCardProps['orientation'];
};

export const FollowingList: FC<FollowingListProps> = ({
  following,
  authUser,
  followingIds,
  handleFollow,
  columns,
  cardOrientation,
}) => {
  const followingGrouped = useMemo(
    () => groupByYearAndMonth(following),
    [following]
  );

  const isAuthenticated = !!authUser?.username;

  return (
    <>
      {followingGrouped.map(({ year, months }) => {
        if (!Array.isArray(months) || !months.length) return null;

        return (
          <CardList.Group key={year} title={year?.toString()} marginBottom='lg'>
            {months.map(({ month, following }) => {
              if (!Array.isArray(following) || !following.length) return null;

              return (
                <CardList.Group
                  key={month}
                  title={monthLabels[month]}
                  titleAs='h4'
                >
                  <CardList.Grid columns={columns}>
                    {following.map(({ followed }) => {
                      if (!followed) return null;

                      const {
                        id,
                        username,
                        name,
                        bio,
                        image_thumb_120,
                        stats_followers,
                      } = followed;

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
    following: Following[];
  }[];
}>;

const groupByYearAndMonth = (arr?: Following[]): GroupedByYearMonth => {
  let year = dayjs().year();
  let month = dayjs().month();

  let copy: Following[] = Array.from(arr || []);
  const grouped: GroupedByYearMonth = [];

  while (copy.length > 0) {
    const { following, nextCopy } = copy.reduce(
      (accum, curr) => {
        const comparison = dayjs(curr.created_at);

        if (comparison.year() === year && comparison.month() === month) {
          accum.following.push(curr);
        } else {
          accum.nextCopy.push(curr);
        }

        return accum;
      },
      {
        following: [] as Following[],
        nextCopy: [] as Following[],
      }
    );

    const index = grouped.findIndex((g) => g.year === year);
    if (index !== -1) {
      grouped[index].months.push({ month, following });
    } else {
      grouped.push({
        year,
        months: [
          {
            month,
            following,
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
