import { ReactNode } from 'react';
import { useRouter } from 'next/router';
import { QueryFunctionContext, useInfiniteQuery } from '@tanstack/react-query';

import { DefaultLayout, Feedback, PageHeading } from '@/components/layout';
import { SEO } from '@/components/utility';
import { ExploreMap } from '@/features/explore';
import { useQueryParam } from '@/hooks';
import { getExploreRoutes } from '@/lib/v1/api/explore';
import { PaginatedRoutes } from '@/types/routes';

const QUERY_SIZE = 20;
const DEFAULT_BOUNDS = JSON.stringify([
  [-135.755337, 22.662322],
  [-59.25607, 50.666255],
]);

const Explore = () => {
  const router = useRouter();

  const bounds = useQueryParam(router.query, 'bounds');

  const mapRoutesQuery = useInfiniteQuery({
    queryKey: ['routes', 'explore-map', bounds || DEFAULT_BOUNDS],
    queryFn: ({ pageParam }: QueryFunctionContext): Promise<PaginatedRoutes> =>
      getExploreRoutes(bounds || DEFAULT_BOUNDS, {
        size: QUERY_SIZE,
        after: pageParam,
      }),
    staleTime: 300_000,
    getNextPageParam: (lastPage: PaginatedRoutes) =>
      (lastPage?.meta?.page?.more && lastPage.meta.page.cursor) || undefined,
    getPreviousPageParam: (firstPage: PaginatedRoutes) =>
      firstPage?.meta?.page?.cursor,
  });

  const renderResult = () => {
    if (!router.isReady) {
      return <Feedback size='xl' type='loading' title='Loading map' />;
    }
    return (
      <ExploreMap
        querySize={QUERY_SIZE}
        mapBounds={bounds || DEFAULT_BOUNDS}
        pages={mapRoutesQuery.data?.pages || []}
        hasMore={mapRoutesQuery.hasNextPage}
        loadMore={() => mapRoutesQuery.fetchNextPage()}
      />
    );
  };

  return (
    <>
      <SEO
        title='Explore Routes'
        description={`Discover routes near a given destination, or see what's trending.`}
      />
      <DefaultLayout.Main>
        <PageHeading>Explore</PageHeading>
        <DefaultLayout.MainContent>{renderResult()}</DefaultLayout.MainContent>
      </DefaultLayout.Main>
    </>
  );
};

Explore.getLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default Explore;
