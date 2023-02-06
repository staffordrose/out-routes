import { ForwardedRef, ReactNode, forwardRef } from 'react';
import * as RadixHoverCard from '@radix-ui/react-hover-card';
import { keyframes } from '@stitches/react';

import { styled } from '@/styles';

export type HoverCardProps = {
  card: ReactNode;
  children: ReactNode;
};

export const HoverCard = forwardRef(
  (
    { card, children }: HoverCardProps,
    ref: ForwardedRef<HTMLAnchorElement>
  ) => (
    <RadixHoverCard.Root>
      <RadixHoverCard.Trigger ref={ref} asChild>
        {children}
      </RadixHoverCard.Trigger>
      <RadixHoverCard.Portal>
        <HoverCardContent sideOffset={4}>
          {card}
          <HoverCardArrow />
        </HoverCardContent>
      </RadixHoverCard.Portal>
    </RadixHoverCard.Root>
  )
);

HoverCard.displayName = 'HoverCard';

const slideUpAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateY(2px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
});

const slideRightAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateX(-2px)' },
  '100%': { opacity: 1, transform: 'translateX(0)' },
});

const slideDownAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateY(-2px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
});

const slideLeftAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateX(2px)' },
  '100%': { opacity: 1, transform: 'translateX(0)' },
});

const HoverCardContent = styled(RadixHoverCard.Content, {
  width: '$full',
  maxWidth: 300,
  borderRadius: '$lg',
  boxShadow:
    'hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px',
  animationDuration: '400ms',
  animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
  willChange: 'transform, opacity',
  '&[data-state="open"]': {
    '&[data-side="top"]': { animationName: slideDownAndFade },
    '&[data-side="right"]': { animationName: slideLeftAndFade },
    '&[data-side="bottom"]': { animationName: slideUpAndFade },
    '&[data-side="left"]': { animationName: slideRightAndFade },
  },
});

const HoverCardArrow = styled(RadixHoverCard.Arrow, {
  fill: '$slate-500',
});
