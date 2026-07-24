import { cn } from '@/utilities/ui'
import React from 'react'

import styles from './SectionHeader.module.css'

type SectionHeaderProps = {
  align?: 'center' | 'left'
  className?: string
  eyebrow?: null | string
  heading?: null | string
  intro?: null | string
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  align = 'left',
  className,
  eyebrow,
  heading,
  intro,
}) => {
  if (!eyebrow && !heading && !intro) return null

  return (
    <div className={cn(styles.header, align === 'center' && styles.centered, className)}>
      {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
      {heading && <h2 className={styles.heading}>{heading}</h2>}
      {intro && <p className={styles.intro}>{intro}</p>}
    </div>
  )
}
