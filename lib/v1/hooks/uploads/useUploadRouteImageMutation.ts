import { useMutation } from '@tanstack/react-query';

import { ToastContents } from '@/components/atoms';
import { Route, RouteImageIdUrls } from '@/types';
import { uploadRouteImage } from '../../api/uploads';

type Variables = {
  id: Route['id'];
  file: File;
};

export type UseUploadRouteImageMutationProps = {
  openToast?: (toastContents: ToastContents) => void;
  onSuccess?: (data: RouteImageIdUrls, variables: Variables) => void;
};

export const useUploadRouteImageMutation = ({
  openToast,
  onSuccess,
}: UseUploadRouteImageMutationProps) => {
  const mutation = useMutation({
    mutationFn: ({ id, file }: Variables) => uploadRouteImage(id, file),
    onError: (error) => {
      if (typeof openToast === 'function') {
        openToast({
          title: 'Oops!',
          description:
            error instanceof Error
              ? error.message
              : `Something went wrong attempting to upload the route image`,
        });
      }

      return error;
    },
    onSuccess,
  });

  return mutation;
};
