import { FC, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { BiImageAdd, BiTrash } from 'react-icons/bi';

import {
  AspectRatio,
  Avatar,
  Button,
  Dialog,
  Flex,
  IconButton,
  ToastContents,
} from '@/components/atoms';
import {
  useDeleteProfileImageMutation,
  useUploadProfileImageMutation,
} from '@/lib/v1/hooks/uploads';
import { styled } from '@/styles';
import { User } from '@/types/users';
import { ProfileImageForm } from '../user';

export type ProfileImageUploaderProps = {
  user: User;
  openToast: (toastContents: ToastContents) => void;
};

export const ProfileImageUploader: FC<ProfileImageUploaderProps> = ({
  user,
  openToast,
}) => {
  const queryClient = useQueryClient();

  const [isUploadImageDialogOpen, setUploadImageDialogOpen] = useState(false);

  const uploadProfileImageMutation = useUploadProfileImageMutation({
    queryClient,
    setDialogOpen: setUploadImageDialogOpen,
    openToast,
  });

  const [isDeleteImageDialogOpen, setDeleteImageDialogOpen] = useState(false);

  const deleteProfileImageMutation = useDeleteProfileImageMutation({
    queryClient,
    setDialogOpen: setDeleteImageDialogOpen,
    openToast,
  });

  return (
    <Container>
      {user.image_full ? (
        <Preview>
          <Avatar
            size='3xl'
            src={user.image_thumb_360 || undefined}
            firstName={user.name?.split(' ')[0]}
            lastName={user.name?.split(' ')[1]}
          />
          <Dialog
            isOpen={isDeleteImageDialogOpen}
            setOpen={setDeleteImageDialogOpen}
            title='Delete profile image?'
            body={
              <Flex direction='column' gap='md'>
                <p>
                  Are you sure you want to delete your profile image? This
                  action cannot be undone.
                </p>
                <Flex justifyContent='end'>
                  <Button
                    variant='solid'
                    colorScheme='red'
                    size='lg'
                    disabled={deleteProfileImageMutation.isLoading}
                    onClick={() => {
                      deleteProfileImageMutation.mutate();
                    }}
                  >
                    Yes, Delete It
                  </Button>
                </Flex>
              </Flex>
            }
          >
            <IconButton
              variant='outline'
              size='lg'
              borderRadius='full'
              disabled={
                deleteProfileImageMutation.isLoading || !user.image_full
              }
              aria-label='Open modal to delete your profile picture'
            >
              <BiTrash />
            </IconButton>
          </Dialog>
        </Preview>
      ) : (
        <UploadFormDialog ratio={1}>
          <Dialog
            isOpen={isUploadImageDialogOpen}
            setOpen={setUploadImageDialogOpen}
            title='Select a Profile Picture'
            body={
              <ProfileImageForm
                isUploading={uploadProfileImageMutation.isLoading}
                onSubmit={({ files }, { reset }) => {
                  uploadProfileImageMutation.mutate({
                    file: files[0],
                    reset,
                  });
                }}
              />
            }
          >
            <IconButton
              variant='ghost'
              size='xl'
              borderRadius='full'
              aria-label='Open modal to add profile picture'
            >
              <BiImageAdd />
            </IconButton>
          </Dialog>
        </UploadFormDialog>
      )}
    </Container>
  );
};

const Container = styled('div', {
  width: '$64',
  height: '$64',
});

const Preview = styled('div', {
  position: 'relative',
  '& > button': {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    opacity: 0,
  },
  '&:hover > button:not(:disabled)': {
    opacity: 1,
  },
  '&:focus-within > button:not(:disabled)': {
    opacity: 1,
  },
});

const UploadFormDialog = styled(AspectRatio, {
  display: 'flex',
  placeItems: 'center',
  borderRadius: '$full',
  backgroundColor: '$slate-50',
});
