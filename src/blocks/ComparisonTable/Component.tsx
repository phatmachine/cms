import type { ComparisonTableBlock as ComparisonTableBlockProps } from '@/payload-types'

import { cn } from '@/utilities/ui'
import { Check, Minus, X } from 'lucide-react'
import React from 'react'

import { Reveal } from '@/components/Reveal'
import { SectionHeader } from '@/components/SectionHeader'

import styles from './ComparisonTable.module.css'

const statusIcon: Record<string, React.ReactNode> = {
  no: <X aria-label="No" className={styles.iconNo} size={16} />,
  partial: <Minus aria-label="Partial" className={styles.iconPartial} size={16} />,
  yes: <Check aria-label="Yes" className={styles.iconYes} size={16} />,
}

export const ComparisonTableBlock: React.FC<ComparisonTableBlockProps> = ({
  columns,
  eyebrow,
  heading,
  rows,
}) => {
  if (!columns || columns.length === 0 || !rows || rows.length === 0) return null

  return (
    <div className={styles.section}>
      <div className="container">
        <SectionHeader eyebrow={eyebrow} heading={heading} />

        <Reveal className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.featureHeader} scope="col" />
                {columns.map((column, index) => (
                  <th
                    className={cn(styles.columnHeader, column.isFeatured && styles.featured)}
                    key={index}
                    scope="col"
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <th className={styles.featureCell} scope="row">
                    {row.feature}
                  </th>
                  {columns.map((column, colIndex) => {
                    const cell = row.cells?.[colIndex]

                    return (
                      <td
                        className={cn(styles.cell, column.isFeatured && styles.featured)}
                        key={colIndex}
                      >
                        {cell ? (
                          <div className={styles.cellContent}>
                            {statusIcon[cell.status || 'yes']}
                            {cell.note && <span className={styles.note}>{cell.note}</span>}
                          </div>
                        ) : null}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </div>
    </div>
  )
}
