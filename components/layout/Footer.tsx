import { FC } from 'react';
import dayjs from 'dayjs';

import { sitename } from '@/data/site';
import { styled } from '@/styles';
import { Link } from '../atoms';

export type FooterProps = {
  marginTop?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
};

export const Footer: FC<FooterProps> = ({ marginTop }) => {
  const year = dayjs().year();

  return (
    <StyledFooter marginTop={marginTop}>
      <div>
        <p>
          <span>&copy;</span> <span>{year}</span>{' '}
          <Link href='/' fontFamily='heading'>
            {sitename}
          </Link>
          {'. '}
          <span>All Rights Reserved</span>
        </p>
      </div>
    </StyledFooter>
  );
};

const StyledFooter = styled('footer', {
  width: '$full',
  borderTopWidth: '$1',
  borderTopStyle: 'solid',
  borderTopColor: '$slate-300',
  '& > div': {
    width: '$full',
    maxWidth: '$container_3xl',
    height: '$full',
    marginX: '$auto',
    paddingY: '$3',
    paddingX: '$4',
  },
  variants: {
    marginTop: {
      xs: { marginTop: '$6' },
      sm: { marginTop: '$12' },
      md: { marginTop: '$24' },
      lg: { marginTop: '$36' },
      xl: { marginTop: '$72' },
    },
  },
});
