import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import * as RadixToast from '@radix-ui/react-toast';
import { styled, keyframes } from '@stitches/react';
import { BiX } from 'react-icons/bi';

import { Button, ButtonProps, IconButton } from '../atoms';

const DEFAULT_CONTENTS = {
  title: '',
  description: '',
  action: undefined,
};

export type ToastContents = {
  title: ReactNode;
  description: ReactNode;
  action?: {
    altText: string;
    btnProps: ButtonProps;
  };
};

export const useToast = () => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [contents, setContents] = useState<ToastContents>(DEFAULT_CONTENTS);
  const timerRef = useRef<number>(0);

  const openToast = useCallback(
    ({ title, description, action }: ToastContents) => {
      setOpen(false);
      window.clearTimeout(timerRef.current);
      setContents({
        title,
        description,
        action,
      });
      timerRef.current = window.setTimeout(() => {
        setOpen(true);
      }, 100);
    },
    []
  );

  useEffect(() => {
    return () => {
      setContents(DEFAULT_CONTENTS);
      window.clearTimeout(timerRef.current);
    };
  }, []);

  return { isOpen, setOpen, openToast, contents };
};

export type ToastProps = {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
  duration?: number;
  contents: ToastContents;
};

export const Toast = ({
  isOpen,
  setOpen,
  duration = 5000,
  contents: { title, description, action },
}: ToastProps) => {
  return (
    <>
      <ToastRoot open={isOpen} onOpenChange={setOpen} duration={duration}>
        <ToastTitle>{title}</ToastTitle>
        <ToastDescription asChild>
          {typeof description === 'string' ? (
            <div>{description}</div>
          ) : (
            description
          )}
        </ToastDescription>
        {action instanceof Object && action !== null && (
          <ToastAction asChild altText={action.altText}>
            <Button {...action.btnProps} />
          </ToastAction>
        )}
        <RadixToast.Close asChild aria-label='Close'>
          <IconButton aria-hidden variant='ghost' size='xs'>
            <BiX />
          </IconButton>
        </RadixToast.Close>
      </ToastRoot>
      <ToastViewport />
    </>
  );
};

const VIEWPORT_PADDING = 24;

const ToastViewport = styled(RadixToast.Viewport, {
  position: 'fixed',
  zIndex: '$toast',
  bottom: 0,
  right: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '$2_5',
  width: 400,
  maxWidth: '100vw',
  margin: 0,
  padding: VIEWPORT_PADDING,
  outline: 'none',
  listStyle: 'none',
});

const hide = keyframes({
  '0%': { opacity: 1 },
  '100%': { opacity: 0 },
});

const slideIn = keyframes({
  from: { transform: `translateX(calc(100% + ${VIEWPORT_PADDING}px))` },
  to: { transform: 'translateX(0)' },
});

const swipeOut = keyframes({
  from: { transform: 'translateX(var(--radix-toast-swipe-end-x))' },
  to: { transform: `translateX(calc(100% + ${VIEWPORT_PADDING}px))` },
});

const ToastRoot = styled(RadixToast.Root, {
  display: 'grid',
  gridTemplateAreas: '"title action" "description action"',
  gridTemplateColumns: 'auto max-content',
  columnGap: '$4',
  alignItems: 'center',
  padding: '$4',
  borderRadius: '$lg',
  backgroundColor: 'white',
  boxShadow:
    'hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px',

  '&[data-state="open"]': {
    animation: `${slideIn} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
  },
  '&[data-state="closed"]': {
    animation: `${hide} 100ms ease-in`,
  },
  '&[data-swipe="move"]': {
    transform: 'translateX(var(--radix-toast-swipe-move-x))',
  },
  '&[data-swipe="cancel"]': {
    transform: 'translateX(0)',
    transition: 'transform 200ms ease-out',
  },
  '&[data-swipe="end"]': {
    animation: `${swipeOut} 100ms ease-out`,
  },
});

const ToastTitle = styled(RadixToast.Title, {
  gridArea: 'title',
  marginBottom: '$1',
  fontSize: '$md',
  fontWeight: '$medium',
  color: '$slate-900',
});

const ToastDescription = styled(RadixToast.Description, {
  gridArea: 'description',
  margin: 0,
  fontSize: '$sm',
  lineHeight: '$md',
  color: '$slate-700',
});

const ToastAction = styled(RadixToast.Action, {
  gridArea: 'action',
});
