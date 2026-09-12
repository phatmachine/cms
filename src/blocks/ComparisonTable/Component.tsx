import type { ComparisonTableBlock as ComparisonTableBlockProps } from '@/payload-types'

import { ExitSectionHeader } from '@/components/ExitSectionHeader'
import { Reveal } from '@/components/Reveal'
import { cn } from '@/utilities/ui'
import React from 'react'

const statusLabel: Record<string, string> = {
  no: 'No',
  partial: 'Partial',
  yes: 'Yes',
}

const statusColor: Record<string, string> = {
  no: 'text-rtm-accent opacity-55',
  partial: 'text-rtm-accent',
  yes: 'text-rtm-umber',
}

export const ComparisonTableBlock: React.FC<ComparisonTableBlockProps> = ({
  columns,
  eyebrow,
  heading,
  rows,
}) => {
  if (!columns || columns.length === 0 || !rows || rows.length === 0) return null

  return (
    <section className="bg-rtm-bg px-[8vw] py-[clamp(80px,12vh,140px)]">
      <ExitSectionHeader eyebrow={eyebrow} heading={heading} />

      <Reveal className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse font-rtm-mono-label">
          <thead>
            <tr>
              <th className="w-[34%] py-3.5 border-b border-rtm-accent" scope="col" />
              {columns.map((column, index) => (
                <th
                  className={cn(
                    'py-3.5 px-5 text-left text-[11px] font-normal tracking-[0.15em] uppercase border-b border-rtm-accent',
                    column.isFeatured ? 'bg-rtm-ground-slab text-rtm-umber' : 'text-rtm-accent',
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
                  className="py-[18px] text-left font-rtm-serif font-normal text-[18px] text-rtm-fg border-b border-rtm-hairline whitespace-nowrap"
                  scope="row"
                >
                  {row.feature}
                </th>
                {columns.map((column, colIndex) => {
                  const cell = row.cells?.[colIndex]
                  const status = cell?.status || 'yes'

                  return (
                    <td
                      className={cn(
                        'py-[18px] px-5 border-b border-rtm-hairline',
                        column.isFeatured && 'bg-rtm-ground-slab',
                      )}
                      key={colIndex}
                    >
                      {cell && (
                        <span
                          className={cn(
                            'text-[11px] tracking-[0.15em] uppercase',
                            statusColor[status],
                          )}
                        >
                          {statusLabel[status]}
                          {cell.note ? ` — ${cell.note}` : ''}
                        </span>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>
    </section>
  )
}
