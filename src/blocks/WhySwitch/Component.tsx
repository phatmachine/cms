import type { WhySwitchBlock as WhySwitchBlockProps } from '@/payload-types'

import { Reveal } from '@/components/Reveal'
import { SectionHeader } from '@/components/SectionHeader'
import React from 'react'

import styles from './WhySwitch.module.css'

export const WhySwitchBlock: React.FC<WhySwitchBlockProps> = ({ benefits, eyebrow, heading, intro }) => {
  return (
    <div className={styles.section}>
      <div className="container">
        <SectionHeader eyebrow={eyebrow} heading={heading} intro={intro} />

        {benefits && benefits.length > 0 && (
          <div className={styles.grid}>
            {benefits.map((benefit, index) => (
              <Reveal className={styles.card} delay={index * 0.08} key={index}>
                <span className={styles.cardIndex}>{String(index + 1).padStart(2, '0')}</span>
                <h3 className={styles.cardTitle}>{benefit.title}</h3>
                <p className={styles.cardDescription}>{benefit.description}</p>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
