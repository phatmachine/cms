import type { Post } from '@/payload-types'

import React from 'react'

import { Alternatives } from './Alternatives'
import { ExitGuideHero } from './Hero'
import { MigrationChecklist } from './MigrationChecklist'
import { MoreExits } from './MoreExits'
import { Subject } from './Subject'
import { WhyExitScrub } from './WhyExitScrub'

/**
 * Composes the fixed-order "Exit Big Tech" post template (see
 * design_handoff/README.md, "Page structure"). Everything but the sitewide
 * nav/footer and the carousel is per-post content read straight off
 * `post.exitGuide`; the carousel is a live query (MoreExits).
 */
export const ExitGuideTemplate: React.FC<{ post: Post }> = ({ post }) => {
  const { exitGuide, heroImage } = post
  if (!exitGuide) return null

  const video = exitGuide.whyExit?.video

  return (
    <>
      <ExitGuideHero hero={exitGuide.hero || {}} heroImage={heroImage} />

      <Subject subject={exitGuide.subject || {}} />

      {video && typeof video === 'object' && (
        <WhyExitScrub
          label={exitGuide.whyExit?.label}
          reasons={exitGuide.whyExit?.reasons || []}
          video={video}
        />
      )}

      <Alternatives
        altsIntro={exitGuide.altsIntro}
        altsLabel={exitGuide.altsLabel}
        alternatives={exitGuide.alternatives || []}
      />

      <MigrationChecklist
        migrationHeading={exitGuide.migrationHeading}
        migrationLabel={exitGuide.migrationLabel}
        migrationSteps={exitGuide.migrationSteps || []}
      />

      <MoreExits post={post} />
    </>
  )
}
