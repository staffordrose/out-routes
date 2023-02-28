import { FC, useState } from 'react';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';

import {
  Button,
  Dialog,
  Flex,
  Link,
  List,
  ToastContents,
} from '@/components/atoms';
import { styled } from '@/styles';
import { User } from '@/types';
import { ProfileImageUploader } from '../uploads';
import { deleteAccount } from '@/lib/v1/api/user';

type AccountDetails = {
  user: User;
  openToast: (contents: ToastContents) => void;
};

export const AccountDetails: FC<AccountDetails> = ({ user, openToast }) => {
  const router = useRouter();

  const [isDialogOpen, setDialogOpen] = useState(false);

  return (
    <StyledAccountDetails>
      <BorderBox
        css={{
          '& > h2': {
            marginBottom: '$2',
          },
        }}
      >
        <h2>Actions</h2>
        <List as='ul' direction='column' gap='sm'>
          <li>
            <Link href='/account/edit'>Edit your profile</Link>
          </li>
          <li>
            <Link href='/account/username'>Change your username</Link>
          </li>
          <li>
            <Dialog
              isOpen={isDialogOpen}
              setOpen={setDialogOpen}
              title='Are you sure?'
              body={
                <Flex direction='column' gap='md'>
                  <p>
                    Are you sure you want to delete your account? This action
                    cannot be undone.
                  </p>
                  <Flex justifyContent='end'>
                    <Button
                      variant='solid'
                      size='md'
                      onClick={() => {
                        try {
                          deleteAccount();
                          signOut();
                          router.push('/');
                        } catch (error) {}
                      }}
                    >
                      Confirm
                    </Button>
                  </Flex>
                </Flex>
              }
            >
              <Button aria-label='Open modal to delete account'>
                Delete your account
              </Button>
            </Dialog>
          </li>
        </List>
      </BorderBox>
      <div>
        <ProfileImageUploader user={user} openToast={openToast} />
      </div>
    </StyledAccountDetails>
  );
};

const StyledAccountDetails = styled('div', {
  display: 'grid',
  gap: '$4',
  alignItems: 'start',
  width: '$full',
  '@md': {
    gridTemplateColumns: '$48 1fr',
  },
  '@lg': {
    gridTemplateColumns: '$64 1fr',
  },
});

const BorderBox = styled('div', {
  paddingX: '$4',
  paddingY: '$3_5',
  borderWidth: '$2',
  borderStyle: 'dashed',
  borderColor: '$slate-200',
  borderRadius: '$xl',
});
