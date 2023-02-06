import { QueryClient, useMutation } from '@tanstack/react-query';
import { UseFormReset } from 'react-hook-form';

import { ToastContents } from '@/components/atoms';
import { ProfileImageFormValues } from '@/features/user';
import { uploadProfileImage } from '../../api/uploads';

export type UseUploadProfileImageMutationProps = {
  queryClient: QueryClient;
  setDialogOpen: (isDialogOpen: boolean) => void;
  openToast: (toastContents: ToastContents) => void;
};

export const useUploadProfileImageMutation = ({
  queryClient,
  setDialogOpen,
  openToast,
}: UseUploadProfileImageMutationProps) => {
  const mutation = useMutation({
    mutationFn: ({
      file,
    }: {
      file: File;
      reset: UseFormReset<ProfileImageFormValues>;
    }) => uploadProfileImage(file),
    onError: (error) => {
      openToast({
        title: 'Oops!',
        description:
          error instanceof Error
            ? error.message
            : `Something went wrong attempting to upload the image`,
      });

      return error;
    },
    onSuccess: (_, { reset }) => {
      if (typeof reset === 'function') reset();

      setDialogOpen(false);

      queryClient.invalidateQueries(['user']);

      openToast({
        title: 'Success!',
        description: `Your profile image was updated`,
      });
    },
  });

  return mutation;
};
