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
  html: {
    overflow: 'hidden',
  },
  body: {
    overflow: 'auto',
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
  h1: {
    fontSize: '2rem',
  },
  h2: {
    fontSize: '1.75rem',
  },
  h3: {
    fontSize: '1.5rem',
  },
  h4: {
    fontSize: '1.25rem',
  },
  h5: {
    fontSize: '1.125rem',
  },
  h6: {
    fontSize: '1rem',
  },
  '#root': {
    isolation: 'isolate',
  },
  '.mapboxgl-popup': {
    width: '$full',
  },
  '.mapboxgl-popup-content': {
    overflow: 'hidden',
    width: '$full',
    padding: 0,
    borderWidth: '$1',
    borderStyle: 'solid',
    borderColor: '$slate-300',
    borderRadius: '$lg',
    backgroundColor: '$slate-50',
  },
  '.mapboxgl-track-marker': {
    position: 'relative',
    width: '$5',
    height: '$5',
    borderRadius: '$full',
    backgroundColor: '$slate-500',
    '&::before': {
      content: '""',
      position: 'absolute',
      zIndex: -1,
      top: '$1',
      left: '$1',
      width: '$3',
      height: '$3',
      borderRadius: '$full',
      backgroundColor: '$white',
    },
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
