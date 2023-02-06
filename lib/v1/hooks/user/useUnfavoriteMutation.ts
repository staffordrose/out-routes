import { QueryClient, useMutation } from '@tanstack/react-query';

import { ToastContents } from '@/components/atoms';
import { User, UsernameAndSlug } from '@/types';
import { unfavoriteRoute } from '../../api/user';

export type UseUnfavoriteMutationProps = {
  queryClient: QueryClient;
  authUser?: Pick<User, 'id'> & Partial<User>;
  openToast: (contents: ToastContents) => void;
};

export const useUnfavoriteMutation = ({
  queryClient,
  authUser,
  openToast,
}: UseUnfavoriteMutationProps) => {
  const mutation = useMutation({
    mutationFn: ({ username, slug }: UsernameAndSlug) =>
      unfavoriteRoute(username, slug),
    onError: (error) => {
      openToast({
        title: 'Oops!',
        description:
          error instanceof Error
            ? error.message
            : `Something went wrong attempting to unstar the route`,
      });

      return error;
    },
    onSuccess: (_, { username, slug }) => {
      // refetch the route to referesh stats
      queryClient.invalidateQueries(['routes', username, slug]);
      // refetch the route owner's routes to refresh stats
      queryClient.invalidateQueries(['routes', username]);

      if (authUser?.username) {
        // refetch the auth user's favorites lists
        queryClient.invalidateQueries(['favorites', authUser.username]);
      }

      // refetch the auth user's favoriting status for the route
      queryClient.invalidateQueries(['isAuthFavoritingRoute', username, slug]);
      // refetch the auth user's list of favorite routes
      queryClient.invalidateQueries(['favoritesIds']);

      openToast({
        title: 'Success!',
        description: `You unstarred ${slug}`,
      });
    },
  });

  return mutation;
};
