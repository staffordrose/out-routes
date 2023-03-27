import {
  ComponentPropsWithoutRef,
  ForwardedRef,
  forwardRef,
  ReactNode,
} from 'react';
import * as RadixTooltip from '@radix-ui/react-tooltip';

import { styled } from '@/styles';

export type TooltipProps = ComponentPropsWithoutRef<
  typeof RadixTooltip.Root
> & {
  content: ReactNode;
  contentSideOffset?: number;
  children: ReactNode;
};

export const Tooltip = forwardRef(
  (
    { content, contentSideOffset = 0, children }: TooltipProps,
    ref: ForwardedRef<HTMLButtonElement>
  ) => {
    return (
      <RadixTooltip.Provider>
        <RadixTooltip.Root>
          <RadixTooltip.Trigger ref={ref} asChild>
            {children}
          </RadixTooltip.Trigger>
          <RadixTooltip.Portal>
            <TooltipContent sideOffset={contentSideOffset}>
              {content}
              <TooltipArrow />
            </TooltipContent>
          </RadixTooltip.Portal>
        </RadixTooltip.Root>
      </RadixTooltip.Provider>
    );
  }
);

Tooltip.displayName = 'Tooltip';

const TooltipContent = styled(RadixTooltip.Content, {
  paddingX: '$2',
  paddingY: '$1_5',
  borderWidth: '$1',
  borderStyle: 'solid',
  borderColor: '$slate-500',
  borderRadius: '$md',
  fontSize: '$md',
  lineHeight: '$sm',
  color: '$slate-900',
  backgroundColor: 'white',
  boxShadow:
    '0px 7.5px 15px -7.5px $colors$slate-900-25, 0px 7.5px 15px -7.5px $colors$slate-900-25',
  userSelect: 'none',
});

const TooltipArrow = styled(RadixTooltip.Arrow, {
  fill: '$slate-500',
});
