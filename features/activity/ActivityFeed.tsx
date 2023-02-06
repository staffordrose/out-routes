import { FC } from 'react';
import InfiniteScroll from 'react-infinite-scroller';

import { Link } from '@/components/atoms';
import { Feedback } from '@/components/layout';
import { styled } from '@/styles';
import { PaginatedActivity } from '@/types';
import { ActivityCard } from '../activity';

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
  pages?: PaginatedActivity[];
  isLoading: boolean;
};

const Pages: FC<PagesProps> = ({ pages, isLoading }) => {
  if (isLoading) {
    return (
      <Feedback key='loading' size='xl' type='loading' title='Loading feed' />
    );
  }
  if (!Array.isArray(pages) || !pages.length) {
    return (
      <Feedback size='xl' type='empty' title='Your feed is empty'>
        <p>
          Once you start following other people and starring routes you should
          start seeing activity. Meanwhile, you can{' '}
          <Link href='/explore'>explore public routes</Link>.
        </p>
      </Feedback>
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
    borderBottomColor: '$slate-200',
  },
});
