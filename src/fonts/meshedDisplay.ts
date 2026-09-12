import localFont from 'next/font/local'

/**
 * Client-licensed display face used for all prose/quotes on the "Exit Big
 * Tech" post template (uppercase, tracked — see tokens.css --font-meshed).
 * Freeware, commercial use permitted; files must not be modified — see
 * src/fonts/meshed-display/License.pdf. Slanted cuts are intentionally not
 * loaded, the brand removed italics.
 */
export const meshedDisplay = localFont({
  display: 'swap',
  src: [
    {
      path: './meshed-display/MeshedDisplay-Regular.woff2',
      style: 'normal',
      weight: '400',
    },
    {
      path: './meshed-display/MeshedDisplay-Medium.woff2',
      style: 'normal',
      weight: '500',
    },
    {
      path: './meshed-display/MeshedDisplay-Bold.woff2',
      style: 'normal',
      weight: '700',
    },
    {
      path: './meshed-display/MeshedDisplay-Black.woff2',
      style: 'normal',
      weight: '900',
    },
  ],
  variable: '--font-meshed-display',
})
