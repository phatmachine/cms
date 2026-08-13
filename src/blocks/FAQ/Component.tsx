'use client'

import type { FAQBlock as FAQBlockProps } from '@/payload-types'

import { Reveal } from '@/components/Reveal'
import RichText from '@/components/RichText'
import { SectionHeader } from '@/components/SectionHeader'
import { cn } from '@/utilities/ui'
import { Plus } from 'lucide-react'
import React, { useState } from 'react'

export const FAQBlock: React.FC<FAQBlockProps> = ({ eyebrow, heading, items }) => {
  const [openIndexes, setOpenIndexes] = useState<Set<number>>(new Set())

  const toggle = (index: number) => {
    setOpenIndexes((current) => {
      const next = new Set(current)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  return (
    <div className="py-32">
      <div className="container">
        <SectionHeader eyebrow={eyebrow} heading={heading} />

        {items && items.length > 0 && (
          <div className="max-w-[780px] flex flex-col">
            {items.map((item, index) => {
              const isOpen = openIndexes.has(index)

              return (
                <Reveal
                  className="border-t border-hairline last:border-b"
                  delay={index * 0.05}
                  key={index}
                >
                  <button
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-4 py-6 bg-transparent border-0 text-left cursor-pointer text-rtm-heading-3 font-rtm-body font-semibold text-ink"
                    onClick={() => toggle(index)}
                    type="button"
                  >
                    <span>{item.question}</span>
                    <Plus
                      className={cn(
                        'shrink-0 text-ink-muted transition-transform duration-200 ease-in-out',
                        isOpen && 'rotate-45',
                      )}
                      size={18}
                    />
                  </button>
                  <div
                    className={cn(
                      'grid grid-rows-[0fr] transition-[grid-template-rows] duration-200 ease-in-out',
                      isOpen && 'grid-rows-[1fr]',
                    )}
                  >
                    <div className="overflow-hidden min-h-0 [&_.payload-richtext]:pb-6 [&_.payload-richtext_p]:m-0 [&_.payload-richtext_p]:mb-[0.75em] [&_.payload-richtext_p]:text-rtm-body [&_.payload-richtext_p]:font-rtm-body [&_.payload-richtext_p]:text-ink-secondary">
                      <RichText data={item.answer} enableGutter={false} enableProse={false} />
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
