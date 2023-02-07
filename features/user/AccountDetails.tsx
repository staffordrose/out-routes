import { FC } from 'react';

import { Link, List, ToastContents } from '@/components/atoms';
import { styled } from '@/styles';
import { User } from '@/types';
import { ProfileImageUploader } from '../uploads';

type AccountDetails = {
  user: User;
  openToast: (contents: ToastContents) => void;
};

export const AccountDetails: FC<AccountDetails> = ({ user, openToast }) => {
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
