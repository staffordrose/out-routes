// From https://usehooks.com/useWindowSize

import { useEffect, useState } from 'react';

export const useWindowSize = () => {
  // initialize state with undefined width/height so server and client renders match
  const [windowSize, setWindowSize] = useState<{
    width?: number;
    height?: number;
  }>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    const onResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', onResize);

    // call handler right away so state gets updated with initial window size
    onResize();

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return windowSize;
};
