import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import { Inter, JetBrains_Mono, Playfair_Display } from 'next/font/google'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { GrainCanvas } from '@/components/GrainCanvas'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { ScrollProgress } from '@/components/ScrollProgress'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'
import { meshedDisplay } from '@/fonts/meshedDisplay'

// Italic is loaded because --font-serif now resolves to Inter, and five call
// sites are explicitly italic (Narrative, Options, ExitSectionHeader, Footer,
// PaperHero). Playfair carried real italics; without these the browser
// synthesises an oblique instead. If those italics get dropped now the type is
// sans, drop 'italic' here too — it is a meaningful chunk of font payload.
const inter = Inter({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['400', '500', '600', '700', '900'],
  variable: '--font-inter',
})

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['400', '500'],
  variable: '--font-playfair',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  // 700 is only used by the exit-guide CTA button. Without a real bold file
  // the browser fakes one by smearing the regular glyphs, which looks muddy at
  // small sizes — so it's loaded properly rather than relying on font-bold.
  weight: ['400', '700'],
  variable: '--font-jetbrains-mono',
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <html
      className={cn(
        GeistSans.variable,
        GeistMono.variable,
        inter.variable,
        playfairDisplay.variable,
        jetbrainsMono.variable,
        meshedDisplay.variable,
      )}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

          <ScrollProgress />
          <GrainCanvas />
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}
