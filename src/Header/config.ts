import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { linkGroup } from '@/fields/linkGroup'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  admin: {
    description: 'Wordmark and the "Index" menu that slides in from the nav button.',
  },
  fields: [
    {
      name: 'navItems',
      label: 'Index links',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
        {
          name: 'meta',
          type: 'text',
          label: 'Category label',
          admin: {
            description: 'Small label shown next to the link, e.g. "Essays" or "Receipts".',
          },
        },
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
    linkGroup({
      appearances: false,
      overrides: {
        name: 'footerLinks',
        label: 'Panel footer links',
        maxRows: 4,
        admin: {
          initCollapsed: true,
          description: 'Small secondary links shown at the bottom of the panel.',
        },
      },
    }),
    {
      name: 'footerNote',
      type: 'text',
      label: 'Panel footer note',
      defaultValue: 'No guilt at your exit. Close this whenever you want.',
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
