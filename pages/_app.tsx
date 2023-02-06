import { ReactNode, useState } from 'react';
import type { NextComponentType } from 'next/types';
import type { AppContext, AppInitialProps, AppLayoutProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import * as Toast from '@radix-ui/react-toast';
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { globalStyles } from '@/styles';

globalStyles();

const MyApp: NextComponentType<AppContext, AppInitialProps, AppLayoutProps> = ({
  Component,
  pageProps,
}: AppLayoutProps) => {
  const [queryClient] = useState(() => new QueryClient());

  const getLayout = Component.getLayout || ((page: ReactNode) => page);

  return (
    <SessionProvider session={pageProps.session}>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <Toast.Provider swipeDirection='right'>
            {getLayout(<Component {...pageProps} />)}
          </Toast.Provider>
          <ReactQueryDevtools initialIsOpen={false} />
        </Hydrate>
      </QueryClientProvider>
    </SessionProvider>
  );
};

export default MyApp;
