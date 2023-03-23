import { FC, useState } from 'react';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';

import {
  Button,
  Dialog,
  Flex,
  Link,
  List,
  Separator,
  ToastContents,
} from '@/components/atoms';
import { styled } from '@/styles';
import { User } from '@/types/users';
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
      <BorderBox>
        <div>
          <h2>Actions</h2>
          <List as='ul' direction='column' gap='sm'>
            <li>
              <Link href='/account/edit'>Edit your profile</Link>
            </li>
            <li>
              <Link href='/account/username'>Change your username</Link>
            </li>
          </List>
        </div>
        <Separator width='full' height='xs' colorScale={300} />
        <div>
          <Dialog
            isOpen={isDialogOpen}
            setOpen={setDialogOpen}
            title='Delete your account?'
            body={
              <Flex direction='column' gap='md'>
                <p>
                  Are you sure you want to delete your account? This action
                  cannot be undone.
                </p>
                <Flex justifyContent='end'>
                  <Button
                    variant='solid'
                    colorScheme='red'
                    size='lg'
                    onClick={() => {
                      try {
                        deleteAccount();
                        signOut();
                        router.push('/');
                      } catch (error) {}
                    }}
                  >
                    Yes, Delete Account
                  </Button>
                </Flex>
              </Flex>
            }
          >
            <Button colorScheme='red' aria-label='Open modal to delete account'>
              Delete your account
            </Button>
          </Dialog>
        </div>
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
  borderWidth: '$1',
  borderStyle: 'solid',
  borderColor: '$slate-300',
  borderRadius: '$xl',
  '& > div:first-child': {
    padding: '$4',
    paddingTop: '$3_5',
    '& > h2': {
      marginBottom: '$2',
    },
  },
  '& > div:last-child': {
    padding: '$4',
  },
});
