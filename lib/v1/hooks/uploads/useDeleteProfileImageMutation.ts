import { QueryClient, useMutation } from '@tanstack/react-query';

import { ToastContents } from '@/components/atoms';
import { deleteProfileImage } from '../../api/uploads';

export type UseDeleteProfileImageMutationProps = {
  queryClient: QueryClient;
  setDialogOpen: (isDialogOpen: boolean) => void;
  openToast: (toastContents: ToastContents) => void;
};

export const useDeleteProfileImageMutation = ({
  queryClient,
  setDialogOpen,
  openToast,
}: UseDeleteProfileImageMutationProps) => {
  const mutation = useMutation({
    mutationFn: () => deleteProfileImage(),
    onError: (error) => {
      openToast({
        title: 'Oops!',
        description:
          error instanceof Error
            ? error.message
            : `Something went wrong attempting to delete the image`,
      });

      return error;
    },
    onSuccess: () => {
      setDialogOpen(false);

      queryClient.invalidateQueries(['user']);

      openToast({
        title: 'Success!',
        description: `Your profile image was deleted`,
      });
    },
  });

  return mutation;
};
