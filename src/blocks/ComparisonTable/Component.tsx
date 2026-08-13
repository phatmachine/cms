import type { ComparisonTableBlock as ComparisonTableBlockProps } from '@/payload-types'

import { cn } from '@/utilities/ui'
import { Check, Minus, X } from 'lucide-react'
import React from 'react'

import { Reveal } from '@/components/Reveal'
import { SectionHeader } from '@/components/SectionHeader'

const statusIcon: Record<string, React.ReactNode> = {
  no: <X aria-label="No" className="text-ink-muted opacity-60" size={16} />,
  partial: <Minus aria-label="Partial" className="text-ink-muted" size={16} />,
  yes: <Check aria-label="Yes" className="text-action" size={16} />,
}

export const ComparisonTableBlock: React.FC<ComparisonTableBlockProps> = ({
  columns,
  eyebrow,
  heading,
  rows,
}) => {
  if (!columns || columns.length === 0 || !rows || rows.length === 0) return null

  return (
    <div className="py-32">
      <div className="container">
        <SectionHeader eyebrow={eyebrow} heading={heading} />

        <Reveal className="overflow-x-auto border border-hairline">
          <table className="w-full min-w-[560px] border-collapse">
            <thead>
              <tr>
                <th className="min-w-[200px]" scope="col" />
                {columns.map((column, index) => (
                  <th
                    className={cn(
                      'py-4 px-6 text-left text-rtm-label font-rtm-body tracking-label text-ink-secondary uppercase border-b border-l border-hairline',
                      column.isFeatured && 'text-action bg-surface-raised',
                    )}
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
                  <th
                    className="py-4 px-6 text-left text-rtm-body-sm font-rtm-body font-semibold text-ink border-b border-hairline whitespace-nowrap"
                    scope="row"
                  >
                    {row.feature}
                  </th>
                  {columns.map((column, colIndex) => {
                    const cell = row.cells?.[colIndex]

                    return (
                      <td
                        className={cn(
                          'py-4 px-6 border-b border-l border-hairline',
                          column.isFeatured && 'bg-surface-raised',
                        )}
                        key={colIndex}
                      >
                        {cell ? (
                          <div className="flex items-center gap-2">
                            {statusIcon[cell.status || 'yes']}
                            {cell.note && (
                              <span className="text-rtm-caption font-rtm-body text-ink-muted">
                                {cell.note}
                              </span>
                            )}
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
