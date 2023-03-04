import { FC } from 'react';
import InfiniteScroll from 'react-infinite-scroller';

import { ButtonLink } from '@/components/atoms';
import { Feedback } from '@/components/layout';
import { styled } from '@/styles';
import { PaginatedActivity } from '@/types';
import { ActivityCard } from '../user';
import { BiCollection } from 'react-icons/bi';

type ActivityFeedProps = {
  pages?: PaginatedActivity[];
  isLoading: boolean;
  hasMore?: boolean;
  loadMore: () => void;
};

export const ActivityFeed: FC<ActivityFeedProps> = ({
  pages,
  isLoading,
  hasMore,
  loadMore,
}) => {
  if (
    !Array.isArray(pages) ||
    !pages.length ||
    (pages.length === 1 &&
      (!Array.isArray(pages[0].records) || !pages[0].records.length))
  ) {
    return (
      <Feedback
        size='xl'
        type='empty'
        icon={BiCollection}
        title='Your feed is empty'
      >
        <p>
          Once you begin following other users, you should start to see
          activity.
        </p>
        <p>Meanwhile, you can explore popular routes.</p>
        <ButtonLink
          variant='solid'
          colorScheme='orange'
          size='md'
          href='/explore'
        >
          Explore Routes
        </ButtonLink>
      </Feedback>
    );
  }

  return (
    <InfiniteScroll
      pageStart={0}
      hasMore={hasMore}
      loadMore={loadMore}
      useWindow={true}
      threshold={200}
      loader={
        <Feedback
          key='loading'
          size='xs'
          type='loading'
          title='Loading posts'
        />
      }
    >
      <Pages pages={pages} isLoading={isLoading} />
    </InfiniteScroll>
  );
};

type PagesProps = {
  pages: PaginatedActivity[];
  isLoading: boolean;
};

const Pages: FC<PagesProps> = ({ pages, isLoading }) => {
  if (isLoading) {
    return (
      <Feedback key='loading' size='xl' type='loading' title='Loading feed' />
    );
  }

  return (
    <>
      {pages.map((page, index) => {
        return (
          <StyledActivityFeed key={index}>
            {page.records.map((activity) => {
              return <ActivityCard key={activity.id} activity={activity} />;
            })}
          </StyledActivityFeed>
        );
      })}
    </>
  );
};

const StyledActivityFeed = styled('div', {
  '&:not(:last-child) > div': {
    borderBottomWidth: '$1',
    borderBottomStyle: 'solid',
    borderBottomColor: '$slate-300',
  },
});
