import { QueryClient, useMutation } from '@tanstack/react-query';

import { ToastContents } from '@/components/atoms';
import { UsernameAndSlug } from '@/types/routes';
import { User } from '@/types/users';
import { favoriteRoute } from '../../api/user';

export type UseFavoriteMutationProps = {
  queryClient: QueryClient;
  authUser?: Pick<User, 'username'>;
  openToast: (contents: ToastContents) => void;
};

export const useFavoriteMutation = ({
  queryClient,
  authUser,
  openToast,
}: UseFavoriteMutationProps) => {
  const mutation = useMutation({
    mutationFn: ({ username, slug }: UsernameAndSlug) =>
      favoriteRoute(username, slug),
    onError: (error) => {
      openToast({
        title: 'Oops!',
        description:
          error instanceof Error
            ? error.message
            : `Something went wrong attempting to star a route`,
      });

      return error;
    },
    onSuccess: (_, { username, slug }) => {
      // refetch the route to refresh stats
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
        description: `You starred ${slug}`,
      });
    },
  });

  return mutation;
};
