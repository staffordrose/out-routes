import { ReactNode } from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import { styled, keyframes } from '@stitches/react';
import { BiX } from 'react-icons/bi';

import { IconButton } from '../atoms';

export type DialogProps = {
  title: string;
  description?: string;
  body: ReactNode;
} & (
  | {
      isOpen: boolean;
      setOpen: (isOpen: boolean) => void;
      children?: ReactNode;
    }
  | {
      isOpen?: never;
      setOpen?: never;
      children: ReactNode;
    }
);

export const Dialog = ({
  isOpen,
  setOpen,
  title,
  description,
  body,
  children,
}: DialogProps) => (
  <RadixDialog.Root open={isOpen} onOpenChange={setOpen}>
    <RadixDialog.Trigger asChild>{children}</RadixDialog.Trigger>
    <RadixDialog.Portal>
      <DialogOverlay />
      <DialogContent>
        <DialogTitle>{title}</DialogTitle>
        {!!description && <DialogDescription>{description}</DialogDescription>}
        {body}
        <DialogClose asChild>
          <IconButton variant='ghost' size='md' aria-label='Close'>
            <BiX />
          </IconButton>
        </DialogClose>
      </DialogContent>
    </RadixDialog.Portal>
  </RadixDialog.Root>
);

const overlayShow = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 1 },
});

const contentShow = keyframes({
  '0%': { opacity: 0, transform: 'translate(-50%, -48%) scale(.96)' },
  '100%': { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
});

const DialogOverlay = styled(RadixDialog.Overlay, {
  position: 'fixed',
  zIndex: '$modal',
  inset: 0,
  backgroundColor: '$slate-overlay',
  animation: `${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
});

const DialogContent = styled(RadixDialog.Content, {
  position: 'fixed',
  zIndex: '$modal-content',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'calc(100vw - $8)',
  maxWidth: 460,
  maxHeight: 'calc(100vh - $8)',
  padding: '$4',
  borderRadius: '$xl',
  backgroundColor: 'white',
  boxShadow:
    'hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px',
  animation: `${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
  '&:focus': {
    outline: 'none',
  },
});

const DialogTitle = styled(RadixDialog.Title, {
  marginBottom: '$4',
  lineHeight: '$2xl',
});

const DialogDescription = styled(RadixDialog.Description, {
  marginBottom: '$4',
  fontSize: '$md',
  color: '$slate-700',
});

const DialogClose = styled(RadixDialog.Close, {
  position: 'absolute !important',
  top: '$4 !important',
  right: '$4 !important',
});
