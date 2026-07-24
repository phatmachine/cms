'use client'

import type { FAQBlock as FAQBlockProps } from '@/payload-types'

import { Reveal } from '@/components/Reveal'
import RichText from '@/components/RichText'
import { SectionHeader } from '@/components/SectionHeader'
import { cn } from '@/utilities/ui'
import { Plus } from 'lucide-react'
import React, { useState } from 'react'

import styles from './FAQ.module.css'

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
    <div className={styles.section}>
      <div className="container">
        <SectionHeader eyebrow={eyebrow} heading={heading} />

        {items && items.length > 0 && (
          <div className={styles.list}>
            {items.map((item, index) => {
              const isOpen = openIndexes.has(index)

              return (
                <Reveal className={styles.item} delay={index * 0.05} key={index}>
                  <button
                    aria-expanded={isOpen}
                    className={styles.question}
                    onClick={() => toggle(index)}
                    type="button"
                  >
                    <span>{item.question}</span>
                    <Plus className={cn(styles.icon, isOpen && styles.iconOpen)} size={18} />
                  </button>
                  <div className={cn(styles.answerWrap, isOpen && styles.answerWrapOpen)}>
                    <div className={styles.answerInner}>
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
