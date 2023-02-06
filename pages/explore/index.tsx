import { ReactNode } from 'react';

import { DefaultLayout, PageHeading } from '@/components/layout';
import { SEO } from '@/components/utility';

const Explore = () => {
  return (
    <>
      <SEO title='Explore' description='Your Lists' />
      <DefaultLayout.Main>
        <PageHeading>Explore</PageHeading>
        <p>
          [This page will have a map filled with the starting coordinates for
          each route]
        </p>
        <p>[It will also show trending routes]</p>
      </DefaultLayout.Main>
    </>
  );
};

Explore.getLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default Explore;
