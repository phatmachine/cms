import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import { CMSLink } from '@/components/Link'

import styles from './Footer.module.css'

export async function Footer() {
  const footerData = await getCachedGlobal('footer', 1)()

  const {
    statement,
    brandName,
    missionLine,
    columns = [],
    copyrightText,
    tagline,
  } = footerData || {}

  const columnCount = columns?.length || 0

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        {statement && <p className={styles.statement}>{statement}</p>}
        <div
          className={styles.grid}
          style={{ gridTemplateColumns: `2fr repeat(${columnCount}, 1fr)` }}
        >
          <div className={styles.brandBlock}>
            <Link className={styles.brandName} href="/">
              {brandName}
            </Link>
            {missionLine && <p className={styles.missionLine}>{missionLine}</p>}
          </div>
          {columns?.map((column, i) => (
            <div className={styles.column} key={i}>
              <span className={styles.columnHeading}>{column.heading}</span>
              {column.links?.map(({ link }, j) => (
                <CMSLink appearance="inline" className={styles.columnLink} key={j} {...link} />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.bottomBar}>
        <div className={styles.bottomBarInner}>
          <span className={styles.bottomBarText}>{copyrightText}</span>
          <span className={styles.bottomBarText}>{tagline}</span>
        </div>
      </div>
    </footer>
  )
}
