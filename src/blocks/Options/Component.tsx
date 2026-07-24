import type { OptionsBlock as OptionsBlockProps } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { Reveal } from '@/components/Reveal'
import { SectionHeader } from '@/components/SectionHeader'
import React from 'react'

import styles from './Options.module.css'

const badgeLabel: Record<string, string> = {
  'editor-pick': "Editor's pick",
  'free': 'Free',
  'open-source': 'Open source',
}

export const OptionsBlock: React.FC<OptionsBlockProps> = ({ eyebrow, heading, intro, options }) => {
  return (
    <div className={styles.section}>
      <div className="container">
        <SectionHeader eyebrow={eyebrow} heading={heading} intro={intro} />

        {options && options.length > 0 && (
          <div className={styles.grid}>
            {options.map((option, index) => (
              <Reveal className={styles.card} delay={index * 0.08} key={index}>
                {option.badge && option.badge !== 'none' && (
                  <span className={styles.badge}>{badgeLabel[option.badge]}</span>
                )}

                {option.logo && (
                  <div className={styles.logo}>
                    <Media htmlElement={null} resource={option.logo} />
                  </div>
                )}

                <h3 className={styles.name}>{option.name}</h3>
                {option.tagline && <p className={styles.tagline}>{option.tagline}</p>}
                {option.description && <p className={styles.description}>{option.description}</p>}

                <div className={styles.footer}>
                  {option.price && <span className={styles.price}>{option.price}</span>}
                  {option.link && (option.link.url || option.link.reference) && (
                    <CMSLink {...option.link} appearance="inline" className={styles.link} />
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
