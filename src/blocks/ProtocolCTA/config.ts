import type { Block } from 'payload'

export const ProtocolCTA: Block = {
  slug: 'protocolCta',
  interfaceName: 'ProtocolCTABlock',
  labels: {
    singular: 'Protocol CTA',
    plural: 'Protocol CTAs',
  },
  fields: [
    {
      name: 'kicker',
      type: 'text',
      defaultValue: 'Practice',
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'body',
      type: 'textarea',
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Background image',
    },
    {
      name: 'formButtonLabel',
      type: 'text',
      label: 'Email capture button label',
      defaultValue: 'Send the protocol',
    },
    {
      name: 'successMessage',
      type: 'text',
      defaultValue: 'On its way.',
    },
  ],
}
