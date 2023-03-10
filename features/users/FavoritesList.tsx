import { FC, useMemo } from 'react';
import dayjs from 'dayjs';

import { GridProps } from '@/components/atoms';
import { CardList } from '@/components/organisms';
import { monthLabels } from '@/data/general';
import { Favorite } from '@/types/favorites';
import { Route, UsernameAndSlug } from '@/types/routes';
import { User } from '@/types/users';
import { RouteCard, RouteCardProps } from '../routes';

type FavoritesListProps = {
  favorites: Favorite[];
  authUser?: User;
  favoritesIds?: Route['id'][];
  handleFavorite: (route: UsernameAndSlug, isFavorited: boolean) => void;
  columns?: GridProps['columns'];
  cardOrientation: RouteCardProps['orientation'];
};

export const FavoritesList: FC<FavoritesListProps> = ({
  favorites,
  authUser,
  favoritesIds,
  handleFavorite,
  columns,
  cardOrientation,
}) => {
  const favoritesGrouped = useMemo(
    () => groupByYearAndMonth(favorites),
    [favorites]
  );

  const isAuthenticated = !!authUser?.username;

  return (
    <>
      {favoritesGrouped.map(({ year, months }) => {
        if (!Array.isArray(months) || !months.length) return null;

        return (
          <CardList.Group key={year} title={year?.toString()} marginBottom='lg'>
            {months.map(({ month, favorites }) => {
              if (!Array.isArray(favorites) || !favorites.length) return null;

              return (
                <CardList.Group
                  key={month}
                  title={monthLabels[month]}
                  titleAs='h4'
                >
                  <CardList.Grid columns={columns}>
                    {favorites.map(({ route }) => {
                      if (!route) return null;

                      const {
                        id,
                        owner,
                        is_private,
                        slug,
                        title,
                        image_card_banner,
                        stats_favorites,
                      } = route;

                      const authIsOwner =
                        isAuthenticated &&
                        authUser.username === owner?.username;

                      const isFavorited = favoritesIds?.includes(id) || false;

                      return (
                        <RouteCard
                          key={id}
                          orientation={cardOrientation}
                          image={image_card_banner}
                          username={owner?.username}
                          slug={slug}
                          is_private={is_private}
                          title={title}
                          stats_favorites={stats_favorites}
                          showFavoriteBtn={isAuthenticated && !authIsOwner}
                          isFavorited={isFavorited}
                          handleFavorite={() =>
                            handleFavorite(
                              { username: owner?.username, slug },
                              isFavorited
                            )
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
    favorites: Favorite[];
  }[];
}>;

const groupByYearAndMonth = (arr?: Favorite[]): GroupedByYearMonth => {
  let year = dayjs().year();
  let month = dayjs().month();

  let copy: Favorite[] = Array.from(arr || []);
  const grouped: GroupedByYearMonth = [];

  while (copy.length > 0) {
    const { favorites, nextCopy } = copy.reduce(
      (accum, curr) => {
        const comparison = dayjs(curr.created_at);

        if (comparison.year() === year && comparison.month() === month) {
          accum.favorites.push(curr);
        } else {
          accum.nextCopy.push(curr);
        }

        return accum;
      },
      {
        favorites: [] as Favorite[],
        nextCopy: [] as Favorite[],
      }
    );

    const index = grouped.findIndex((g) => g.year === year);
    if (index !== -1) {
      grouped[index].months.push({ month, favorites });
    } else {
      grouped.push({
        year,
        months: [
          {
            month,
            favorites,
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
