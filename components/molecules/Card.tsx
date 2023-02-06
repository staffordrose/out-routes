import {
  ForwardedRef,
  ForwardRefExoticComponent,
  RefAttributes,
  forwardRef,
} from 'react';

import { styled } from '@/styles';
import { Flex, FlexProps } from '../atoms';

export type CardProps = Omit<FlexProps, 'direction'> & {
  orientation?: 'horizontal' | 'vertical';
};

type CardComponent = ForwardRefExoticComponent<
  CardProps & RefAttributes<HTMLDivElement>
> & {
  Image: ForwardRefExoticComponent<ImageProps & RefAttributes<HTMLDivElement>>;
  Body: ForwardRefExoticComponent<BodyProps & RefAttributes<HTMLDivElement>>;
};

export const Card = forwardRef(
  ({ orientation, ...props }: CardProps, ref: ForwardedRef<HTMLDivElement>) => {
    return (
      <StyledCard
        {...props}
        ref={ref}
        direction={orientation === 'vertical' ? 'column' : 'row'}
        orientation={orientation}
      />
    );
  }
) as CardComponent;

Card.displayName = 'Card';

const StyledImage = styled(Flex, {
  flexShrink: 0,
  position: 'relative',
  top: 0,
  bottom: 0,
  overflow: 'hidden',
  variants: {
    bg: {
      'slate-200': {
        backgroundColor: '$slate-200',
      },
      none: {
        backgroundColor: 'transparent',
      },
    },
  },
  defaultVariants: {
    bg: 'slate-200',
  },
});

const StyledBody = styled(Flex, {
  padding: '$4',
});

const StyledCard = styled(Flex, {
  position: 'relative',
  overflow: 'hidden',
  borderWidth: '$1',
  borderStyle: 'solid',
  borderColor: '$slate-200',
  borderRadius: '$lg',
  backgroundColor: '$slate-50',
  variants: {
    orientation: {
      horizontal: {
        alignItems: 'center',
        [`& ${StyledImage}`]: {
          width: 90,
          height: '$full',
          '& > img': {
            objectFit: 'cover',
          },
        },
        [`& ${StyledBody}`]: {
          flexDirection: 'row',
        },
      },
      vertical: {
        [`& ${StyledImage}`]: {
          width: '$full',
        },
        [`& ${StyledBody}`]: {
          flexDirection: 'column',
        },
      },
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
});

// Image
type ImageProps = FlexProps & {
  bg?: 'slate-200' | 'none';
};

const Image = forwardRef(
  (props: ImageProps, ref: ForwardedRef<HTMLDivElement>) => {
    return <StyledImage {...props} ref={ref} />;
  }
);

Image.displayName = 'Image';

Card.Image = Image;

// Body
type BodyProps = Omit<FlexProps, 'direction'>;

const Body = forwardRef(
  (props: BodyProps, ref: ForwardedRef<HTMLDivElement>) => {
    return <StyledBody {...props} ref={ref} />;
  }
);

Body.displayName = 'Card.Body';

Card.Body = Body;
