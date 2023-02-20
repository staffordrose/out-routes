import { MutableRefObject, useEffect } from 'react';

export const useTextareaAutoResize = (
  ref: MutableRefObject<HTMLTextAreaElement | null>
) => {
  useEffect(() => {
    if (ref.current) {
      const el = ref.current;

      const onInput = () => {
        el.style.height = '0px';
        el.style.height = el.scrollHeight + 'px';
      };

      el.setAttribute(
        'style',
        'height:' + el.scrollHeight + 'px;overflow-y:hidden;'
      );
      el.addEventListener('input', onInput, false);

      return () => {
        el.removeEventListener('input', onInput, false);
      };
    }
  }, [ref]);
};
