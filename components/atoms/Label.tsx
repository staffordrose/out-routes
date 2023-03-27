import {
  ComponentPropsWithoutRef,
  ElementType,
  ForwardedRef,
  forwardRef,
} from 'react';
import * as RadixLabel from '@radix-ui/react-label';
import type * as Stitches from '@stitches/react';

import { styled } from '@/styles';

export type LabelProps = ComponentPropsWithoutRef<typeof LabelRoot> & {
  as?: ElementType;
  css?: Stitches.CSS;
};

export const Label = forwardRef(
  (props: LabelProps, ref: ForwardedRef<HTMLLabelElement>) => {
    return <LabelRoot {...props} ref={ref} />;
  }
);

Label.displayName = 'Label';

const LabelRoot = styled(RadixLabel.Root, {
  fontSize: '$md',
  fontWeight: '$medium',
  userSelect: 'none',
});
