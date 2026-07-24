'use client'

import type { HowToSwitchBlock as HowToSwitchBlockProps } from '@/payload-types'

import { Media } from '@/components/Media'
import { SectionHeader } from '@/components/SectionHeader'
import { cn } from '@/utilities/ui'
import { useStepScrollSync } from '@/utilities/useScrollReveal'
import React from 'react'

import styles from './HowToSwitch.module.css'

export const HowToSwitchBlock: React.FC<HowToSwitchBlockProps> = ({
  eyebrow,
  heading,
  intro,
  steps,
}) => {
  const count = steps?.length || 0
  const { activeIndex, setStepRef } = useStepScrollSync(count)
  const activeStep = steps?.[activeIndex]

  return (
    <div className={styles.section}>
      <div className="container">
        <SectionHeader eyebrow={eyebrow} heading={heading} intro={intro} />

        {steps && steps.length > 0 && (
          <div className={styles.layout}>
            <ol className={styles.steps}>
              {steps.map((step, index) => (
                <li
                  className={cn(styles.step, index === activeIndex && styles.stepActive)}
                  key={index}
                  ref={setStepRef(index)}
                >
                  <span className={styles.stepIndex}>{String(index + 1).padStart(2, '0')}</span>
                  <div className={styles.stepBody}>
                    <h3 className={styles.stepTitle}>{step.title}</h3>
                    <p className={styles.stepDescription}>{step.description}</p>
                    {step.media && (
                      <div className={styles.stepMediaMobile}>
                        <Media resource={step.media} />
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ol>

            <div className={styles.panel}>
              <div className={styles.panelSticky}>
                {activeStep?.media ? (
                  <Media key={activeIndex} resource={activeStep.media} />
                ) : (
                  <div className={styles.panelPlaceholder}>{activeStep?.title}</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
