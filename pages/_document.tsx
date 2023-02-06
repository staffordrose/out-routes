import { Html, Head, Main, NextScript } from 'next/document';

import { getCssText } from '@/styles';

const MyDocument = () => {
  return (
    <Html lang='en'>
      <Head>
        <meta charSet='utf-8' />
        <link
          rel='preload'
          href='/fonts/Quicksand-Bold.woff2'
          as='font'
          type='font/woff2'
          crossOrigin='anonymous'
        />
        <link
          rel='preload'
          href='/fonts/Quicksand-Medium.woff2'
          as='font'
          type='font/woff2'
          crossOrigin='anonymous'
        />
        <link
          rel='preload'
          href='/fonts/Quicksand-Light.woff2'
          as='font'
          type='font/woff2'
          crossOrigin='anonymous'
        />
        <link
          href='https://api.mapbox.com/mapbox-gl-js/v2.12.0/mapbox-gl.css'
          rel='stylesheet'
        />
        <link
          rel='stylesheet'
          href='https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-draw/v1.3.0/mapbox-gl-draw.css'
          type='text/css'
        />
        <style
          id='stitches'
          dangerouslySetInnerHTML={{ __html: getCssText() }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default MyDocument;
