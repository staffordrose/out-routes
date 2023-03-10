import { FC, useMemo } from 'react';
import flatten from 'lodash.flatten';

import { styled } from '@/styles';
import { PaginatedRoutes } from '@/types/routes';
import { useMap } from './hooks';
import { Button } from '@/components/atoms';

type ExploreMapProps = {
  querySize: number;
  mapBounds?: string | null;
  pages: PaginatedRoutes[];
  hasMore?: boolean;
  loadMore: () => void;
};

export const ExploreMap: FC<ExploreMapProps> = ({
  querySize,
  mapBounds,
  pages,
  hasMore,
  loadMore,
}) => {
  const routes = useMemo(
    () => flatten(pages.map(({ records }) => records)) || [],
    [pages]
  );

  const { mapContainerEl } = useMap({ mapBounds, routes });

  return (
    <StyledMap>
      {hasMore && (
        <div className='load-more'>
          <Button onClick={loadMore}>Load {querySize} More</Button>
        </div>
      )}
      <div ref={mapContainerEl} />
    </StyledMap>
  );
};

const StyledMap = styled('div', {
  position: 'relative',
  overflow: 'hidden',
  display: 'grid',
  width: '$full',
  borderWidth: '$1',
  borderStyle: 'solid',
  borderColor: '$slate-300',
  borderRadius: '$xl',
  '& > div.load-more': {
    position: 'absolute',
    zIndex: 10,
    top: '$4',
    left: '$4',
    width: '$auto',
    height: '$auto',
  },
  '& > div': {
    width: '$full',
    height: 'calc(540px - ($borderWidths$2 + $borderWidths$2))',
    backgroundColor: '$slate-200',
  },
  '@md': {
    '& > div': {
      height: 'calc(640px - ($borderWidths$2 + $borderWidths$2))',
    },
  },
});
