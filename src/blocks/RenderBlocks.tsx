import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ComparisonTableBlock } from '@/blocks/ComparisonTable/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FAQBlock } from '@/blocks/FAQ/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { HowToSwitchBlock } from '@/blocks/HowToSwitch/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { OptionsBlock } from '@/blocks/Options/Component'
import { TestimonialBlock } from '@/blocks/Testimonial/Component'
import { WhySwitchBlock } from '@/blocks/WhySwitch/Component'

const blockComponents = {
  archive: ArchiveBlock,
  comparisonTable: ComparisonTableBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  faq: FAQBlock,
  formBlock: FormBlock,
  howToSwitch: HowToSwitchBlock,
  mediaBlock: MediaBlock,
  options: OptionsBlock,
  testimonial: TestimonialBlock,
  whySwitch: WhySwitchBlock,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div className="my-16" key={index}>
                  {/* @ts-expect-error there may be some mismatch between the expected types here */}
                  <Block {...block} disableInnerContainer />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
