import { FC, ReactNode, useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BiSearch } from 'react-icons/bi';

import { Box, Dialog, Flex, Input, Text } from '@/components/atoms';
import { Feedback } from '@/components/layout';
import { useDebounce, usePrevious } from '@/hooks';
import { searchRoutesAndUsers } from '@/lib/v1/api/search';
import { Route } from '@/types/routes';
import { User } from '@/types/users';
import { RouteCard } from '../routes';
import { UserCard } from '../users';

export type SearchDialogProps = {
  isDialogOpen: boolean;
  setDialogOpen: (isDialogOpen: boolean) => void;
  children: ReactNode;
};

export const SearchDialog: FC<SearchDialogProps> = ({
  isDialogOpen,
  setDialogOpen,
  children,
}) => {
  const [query, setQuery] = useState('');

  const prevIsDialogOpen = usePrevious(isDialogOpen);

  useEffect(() => {
    if (prevIsDialogOpen && !isDialogOpen) {
      setQuery('');
    }
  }, [isDialogOpen, prevIsDialogOpen]);

  const debouncedQuery = useDebounce(query, 300);

  const enabled = debouncedQuery.length > 0;

  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ['searchRoutesAndUsers', debouncedQuery],
    queryFn: () => searchRoutesAndUsers(debouncedQuery),
    staleTime: 300_000,
    enabled,
  });

  const renderResult = () => {
    if (enabled && isLoading) {
      return <Feedback size='md' type='loading' title='Loading results' />;
    }
    if (isError) {
      return (
        <Feedback size='md' type='error' title='Something went wrong'>
          {error instanceof Error ? error.message : null}
        </Feedback>
      );
    }
    if (isSuccess) {
      if (!Array.isArray(data) || !data.length) {
        return (
          <Feedback
            size='md'
            icon={BiSearch}
            type='empty'
            title='Please Try Again'
          >
            No routes or users match your search.
          </Feedback>
        );
      }

      return (
        <>
          <Text
            as='span'
            fontFamily='heading'
            fontSize='xl'
            fontWeight='medium'
          >
            {data.length || 0} Results
          </Text>
          <Box
            width='full'
            css={{
              overflowY: 'auto',
            }}
          >
            <Flex direction='column' gap='md' width='full'>
              {data.map(({ table, record }) => {
                switch (table) {
                  case 'users': {
                    const userRecord = record as User;
                    const {
                      id,
                      username,
                      name,
                      image_thumb_64,
                      stats_followers,
                    } = userRecord;

                    return (
                      <UserCard
                        key={`${table}-${id}`}
                        orientation='horizontal'
                        image={image_thumb_64}
                        name={name}
                        username={username}
                        stats_followers={stats_followers}
                        onNavigate={() => {
                          setDialogOpen(false);
                        }}
                      />
                    );
                  }
                  case 'routes': {
                    const routeRecord = record as Route;
                    const {
                      id,
                      owner,
                      slug,
                      title,
                      image_thumb_120,
                      static_image_thumb_120,
                      stats_favorites,
                    } = routeRecord;

                    return (
                      <RouteCard
                        key={`${table}-${id}`}
                        orientation='horizontal'
                        {...routeRecord}
                        image={image_thumb_120 || static_image_thumb_120}
                        username={owner?.username}
                        slug={slug || ''}
                        title={title || ''}
                        stats_favorites={stats_favorites}
                        onNavigate={() => {
                          setDialogOpen(false);
                        }}
                      />
                    );
                  }
                  default:
                    return null;
                }
              })}
            </Flex>
          </Box>
        </>
      );
    }
    return (
      <Feedback
        size='md'
        type='empty'
        icon={BiSearch}
        title='Enter a search query'
      />
    );
  };

  return (
    <Dialog
      isOpen={isDialogOpen}
      setOpen={setDialogOpen}
      title='Search'
      body={
        <Flex
          direction='column'
          gap='lg'
          css={{
            height: '75vh',
            '& > *:first-child': {
              flexShrink: 0,
            },
          }}
        >
          <SearchInput query={query} setQuery={setQuery} />
          <Flex
            direction='column'
            gap='sm'
            css={{
              overflow: 'hidden',
            }}
          >
            {renderResult()}
          </Flex>
        </Flex>
      }
    >
      {children}
    </Dialog>
  );
};

type SearchInputProps = {
  query: string;
  setQuery: (query: string) => void;
};

const SearchInput: FC<SearchInputProps> = ({ query, setQuery }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <Input
      ref={inputRef}
      size='lg'
      type='text'
      placeholder='Enter search'
      value={query}
      onChange={({ target: { value } }) => setQuery(value)}
    />
  );
};
