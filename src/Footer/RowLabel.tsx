'use client'
import { Footer } from '@/payload-types'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

type FooterColumn = NonNullable<Footer['columns']>[number]

export const RowLabel: React.FC<RowLabelProps> = () => {
  const data = useRowLabel<NonNullable<FooterColumn['links']>[number]>()

  const label = data?.data?.link?.label
    ? `Link ${data.rowNumber !== undefined ? data.rowNumber + 1 : ''}: ${data?.data?.link?.label}`
    : 'Row'

  return <div>{label}</div>
}

export const ColumnRowLabel: React.FC<RowLabelProps> = () => {
  const data = useRowLabel<FooterColumn>()

  const label = data?.data?.heading
    ? `Column ${data.rowNumber !== undefined ? data.rowNumber + 1 : ''}: ${data?.data?.heading}`
    : 'Column'

  return <div>{label}</div>
}
