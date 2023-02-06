import { FC, useEffect, useState } from 'react';

import { styled } from '@/styles';

const svg = `
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'>
    <path
      opacity='0.25'
      d='M16 0 A16 16 0 0 0 16 32 A16 16 0 0 0 16 0 M16 4 A12 12 0 0 1 16 28 A12 12 0 0 1 16 4'
    />
    <path d='M16 0 A16 16 0 0 1 32 16 L28 16 A12 12 0 0 0 16 4z'>
      <animateTransform
        attributeName='transform'
        type='rotate'
        from='0 16 16'
        to='360 16 16'
        dur='0.8s'
        repeatCount='indefinite'
      />
    </path>
  </svg>
`;

type LoadingProps = {
  size?:
    | 'xs'
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | '2xl'
    | '3xl'
    | '4xl'
    | '5xl'
    | '6xl';
  fill?: 'slate';
  delay?: number;
};

export const Loading: FC<LoadingProps> = ({
  size,
  fill,
  delay = 0,
  ...props
}) => {
  const [delayed, setDelayed] = useState(delay > 0);

  useEffect(() => {
    if (delayed) {
      const timeout = setTimeout(() => {
        setDelayed(false);
      }, delay);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [delayed, delay]);

  return (
    <StyledLoading
      dangerouslySetInnerHTML={{ __html: svg }}
      size={size}
      fill={fill}
      {...props}
    />
  );
};

const StyledLoading = styled('div', {
  variants: {
    size: {
      xs: {
        width: '$4_5',
        height: '$4_5',
      },
      sm: {
        width: '$6',
        height: '$6',
      },
      md: {
        width: '$8',
        height: '$8',
      },
      lg: {
        width: '$9_5',
        height: '$9_5',
      },
      xl: {
        width: '$11',
        height: '$11',
      },
      '2xl': {
        width: '$13',
        height: '$13',
      },
      '3xl': {
        width: '$15',
        height: '$15',
      },
      '4xl': {
        width: '$17',
        height: '$17',
      },
      '5xl': {
        width: '$20',
        height: '$20',
      },
      '6xl': {
        width: '$24',
        height: '$24',
      },
    },
    fill: {
      slate: { fill: '$slate-700' },
    },
  },
  defaultVariants: {
    size: 'sm',
    fill: 'slate',
  },
});
