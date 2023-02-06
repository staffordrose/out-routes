import { QueryClient, useMutation } from '@tanstack/react-query';

import { ToastContents } from '@/components/atoms';
import { User } from '@/types';
import { unfollowUser } from '../../api/user';

export type UseUnfollowMutationProps = {
  queryClient: QueryClient;
  authUser?: Pick<User, 'id'> & Partial<User>;
  openToast: (contents: ToastContents) => void;
};

export const useUnfollowMutation = ({
  queryClient,
  authUser,
  openToast,
}: UseUnfollowMutationProps) => {
  const mutation = useMutation({
    mutationFn: ({ username }: Pick<User, 'username'>) =>
      unfollowUser(username),
    onError: (error) => {
      openToast({
        title: 'Oops!',
        description:
          error instanceof Error
            ? error.message
            : `Something went wrong attempting to unfollow the user`,
      });

      return error;
    },
    onSuccess: (_, { username }) => {
      // refetch the user to refresh stats
      queryClient.invalidateQueries(['users', username]);
      // refetch the user's followers to add auth user
      queryClient.invalidateQueries(['followers', username]);

      if (authUser?.username) {
        // refetch auth user's profile page to refresh stats
        queryClient.invalidateQueries(['users', authUser.username]);
        // refetch auth user's followers list (when auth follows back a user in the list)
        queryClient.invalidateQueries(['followers', authUser.username]);
        // refetch auth user's following list to add user
        queryClient.invalidateQueries(['following', authUser.username]);
      }

      // update auth user's following status
      queryClient.invalidateQueries(['isAuthFollowingUser', username]);
      // update auth user's list of users they are following
      queryClient.invalidateQueries(['followingIds']);

      openToast({
        title: 'Success!',
        description: `You are no longer following @${username}`,
      });
    },
  });
  return mutation;
};
