// https://www.joshwcomeau.com/css/custom-css-reset

import { globalCss } from './stitches.config';

export const globalStyles = globalCss({
  '@font-face': [
    {
      fontDisplay: 'swap',
      fontFamily: 'Quicksand',
      fontStyle: 'normal',
      fontWeight: 700,
      src: 'url("/fonts/Quicksand-Bold.woff2") format("woff2"), url("/fonts/Quicksand-Bold.ttf") format("ttf")',
    },
    {
      fontDisplay: 'swap',
      fontFamily: 'Quicksand',
      fontStyle: 'normal',
      fontWeight: 500,
      src: 'url("/fonts/Quicksand-Medium.woff2") format("woff2"), url("/fonts/Quicksand-Medium.ttf") format("ttf")',
    },
    {
      fontDisplay: 'swap',
      fontFamily: 'Quicksand',
      fontStyle: 'normal',
      fontWeight: 300,
      src: 'url("/fonts/Quicksand-Light.woff2") format("woff2"), url("/fonts/Quicksand-Light.ttf") format("ttf")',
    },
  ],
  '*, *::before, *::after': { boxSizing: 'border-box' },
  '*': { margin: 0, padding: 0 },
  'html, body': { height: '$full' },
  body: {
    minWidth: 320,
    fontFamily: '$body',
    fontWeight: '$light',
    lineHeight: '$xl',
    WebkitFontSmoothing: 'antialiased',
  },
  'img, picture, video, canvas, svg': {
    display: 'block',
    maxWidth: '$full',
  },
  'input, button, textarea, select': {
    font: 'inherit',
  },
  'h1, h2, h3, h4, h5, h6': {
    fontFamily: '$heading',
    fontWeight: '$medium',
  },
  'h1, h2, h3, h4, h5, h6, p': {
    overflowWrap: 'break-word',
  },
  '#root': {
    isolation: 'isolate',
  },
  '.mapboxgl-popup': {
    width: '$full',
  },
  '.mapboxgl-popup-content': {
    overflowY: 'auto',
    width: '$full',
    minHeight: 254,
    maxHeight: 320,
    padding: '$2',
    borderWidth: '$1',
    borderStyle: 'solid',
    borderColor: '$slate-200',
    borderRadius: '$lg',
    backgroundColor: '$slate-50',
  },
  [`
    .mapboxgl-popup-anchor-top .mapboxgl-popup-tip,
    .mapboxgl-popup-anchor-top-left .mapboxgl-popup-tip,
    .mapboxgl-popup-anchor-top-right .mapboxgl-popup-tip
  `]: {
    borderBottomColor: '$slate-500',
  },
  [`
  .mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip,
  .mapboxgl-popup-anchor-bottom-left .mapboxgl-popup-tip,
  .mapboxgl-popup-anchor-bottom-right .mapboxgl-popup-tip
  `]: {
    borderTopColor: '$slate-500',
  },
  '.mapboxgl-popup-anchor-left .mapboxgl-popup-tip': {
    borderRightColor: '$slate-500',
  },
  '.mapboxgl-popup-anchor-right .mapboxgl-popup-tip': {
    borderLeftColor: '$slate-500',
  },
});

export default globalStyles;
