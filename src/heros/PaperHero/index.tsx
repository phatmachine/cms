import React from 'react'

import type { Media as MediaType, Page } from '@/payload-types'

import { PaperHeroClient } from './PaperHero.client'

type PaperHeroProps = Page['hero']

const isMediaObject = (value: unknown): value is MediaType =>
  Boolean(value) && typeof value === 'object'

/**
 * Server wrapper for the Paper hero: picks one of up to 3 configured images
 * at random per request. This route is force-dynamic (see
 * `src/app/(frontend)/page.tsx`), so every visit re-runs this pick — no
 * caching to work around, no client/server hydration mismatch, since the
 * choice is made once here and passed down as a resolved value.
 */
export const PaperHero: React.FC<PaperHeroProps> = ({
  eyebrow,
  media,
  paperSettings,
  richText,
}) => {
  const candidates = (paperSettings?.heroImages || [])
    .map((row) => row.image)
    .filter(isMediaObject)

  if (candidates.length === 0 && isMediaObject(media)) {
    candidates.push(media)
  }

  const chosen = candidates.length > 0 ? candidates[Math.floor(Math.random() * candidates.length)] : null

  return (
    <PaperHeroClient
      eyebrow={eyebrow}
      media={chosen}
      paperSettings={paperSettings}
      richText={richText}
    />
  )
}
