import type { Tab } from 'payload'

import {
  allowedVerdicts,
  CRITERIA,
  type CriterionLike,
  RESULT_LABEL,
  RESULTS,
  VERDICT_LABEL,
  VERDICTS,
} from '../../utilities/audit'

/**
 * "Sovereignty audit" editorial template (postType: audit). Every element on the page
 * maps to a field here. The data mirrors the audit file written by the
 * `rtm-sovereignty-audit` skill (its YAML summary block plus the body), and
 * `scripts/import-audits.ts` fills it from that Markdown.
 *
 * As with the exit-guide tab, `admin.condition` only hides the tab in the admin UI;
 * Payload still validates submitted data regardless. So singular fields use a validate
 * gated on the sibling `postType` instead of `required: true`, which would block saving
 * ordinary posts, and the tests array carries no `minRows`.
 *
 * Text fields hold [S#] citations as written; the template turns them into links to
 * the sources table.
 */
const requiredForAudit =
  (label: string) =>
  (value: unknown, { data }: { data?: unknown }) => {
    const postType = (data as { postType?: string } | undefined)?.postType
    if (postType === 'audit' && !value) return `${label} is required for Audit posts`
    return true
  }

export const auditTab: Tab = {
  name: 'audit',
  label: 'Audit',
  admin: {
    condition: (data) => (data as { postType?: string } | undefined)?.postType === 'audit',
    description:
      'Only used when Post Type (sidebar) is "Audit". The scorecard, verdict, tests and sources all read from these fields.',
  },
  fields: [
    {
      name: 'serviceName',
      type: 'text',
      label: 'Service audited (e.g. Proton Mail)',
      validate: requiredForAudit('Service name'),
    },
    {
      type: 'row',
      fields: [
        {
          name: 'serviceDescriptor',
          type: 'text',
          label: 'What it is (e.g. GPU cloud)',
          admin: { width: '50%' },
        },
        { name: 'serviceCategory', type: 'text', label: 'Category', admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'operator', type: 'text', label: 'Operator (legal entity)', admin: { width: '50%' } },
        { name: 'country', type: 'text', admin: { width: '35%' } },
        { name: 'version', type: 'number', admin: { step: 1, width: '15%' }, min: 1 },
      ],
    },
    {
      name: 'alternativeTo',
      type: 'text',
      hasMany: true,
      label: 'Alternative to',
      admin: { description: 'The services readers would be leaving, e.g. Gmail, Outlook.' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'verdict',
          type: 'select',
          admin: {
            description:
              'Applied mechanically from the tests below, never rounded up. Saving is blocked if the tier is more favourable than the tests allow.',
            width: '50%',
          },
          options: VERDICTS.map((v) => ({ label: VERDICT_LABEL[v], value: v })),
          validate: (
            value: null | string | string[] | undefined,
            { data, siblingData }: { data?: unknown; siblingData?: unknown },
          ) => {
            const postType = (data as { postType?: string } | undefined)?.postType
            if (postType !== 'audit') return true
            if (!value) return 'Verdict is required for Audit posts'
            const tests = ((siblingData as { tests?: { key?: string; result?: string }[] })?.tests || []).filter(
              (t) => t.key && t.result,
            ) as CriterionLike[]
            if (tests.length !== CRITERIA.length) return true // incomplete: nothing to check yet
            const allowed = allowedVerdicts(tests)
            return (allowed as string[]).includes(value as string)
              ? true
              : `Does not match the tests (they allow: ${allowed.map((v) => VERDICT_LABEL[v]).join(' / ')}).`
          },
        },
        {
          name: 'unverified',
          type: 'checkbox',
          label: 'Unverified (a test could not be verified)',
          admin: { width: '50%' },
          defaultValue: false,
        },
      ],
    },
    {
      name: 'takeaway',
      type: 'text',
      admin: { description: 'Twelve words or fewer, drawn from the strongest case against. Shown large under the title.' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'checkedAt',
          type: 'date',
          label: 'Checked',
          admin: { date: { pickerAppearance: 'dayOnly' }, width: '50%' },
          validate: requiredForAudit('Checked date'),
        },
        {
          name: 'recheckBy',
          type: 'date',
          label: 'Re-check by',
          admin: {
            date: { pickerAppearance: 'dayOnly' },
            description: 'Verdicts expire after six months, or at once on a sale or terms change. The page shows a banner once this date passes.',
            width: '50%',
          },
          validate: requiredForAudit('Re-check date'),
        },
      ],
    },
    { name: 'scope', type: 'textarea', admin: { description: 'Exactly what was audited.' } },
    {
      name: 'summary',
      type: 'textarea',
      admin: { description: 'The verdict and the findings that decided it. Every sentence ends with its [S#] source.' },
    },
    {
      name: 'tests',
      type: 'array',
      label: 'The six tests',
      admin: {
        description:
          'One row per test, in order. A test with no verifiable evidence is UNVERIFIED or a FLAG, never a PASS.',
        initCollapsed: false,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'key',
              type: 'select',
              admin: { width: '60%' },
              options: CRITERIA.map((c) => ({ label: c.long, value: c.key })),
              required: true,
            },
            {
              name: 'result',
              type: 'select',
              admin: { width: '40%' },
              options: RESULTS.map((r) => ({ label: RESULT_LABEL[r].toUpperCase(), value: r })),
              required: true,
            },
          ],
        },
        {
          name: 'headline',
          type: 'text',
          admin: { description: 'Six words or fewer, factual, no adjectives of judgement. Shown beside the ring.' },
        },
        {
          name: 'finding',
          type: 'textarea',
          admin: { description: 'Every sentence ends with its [S#] source.' },
          required: true,
        },
        {
          name: 'readerCanDo',
          type: 'textarea',
          label: 'What a reader can do',
          admin: { description: 'Flags only: a mitigation the reader can apply.' },
        },
      ],
    },
    { name: 'strongestCaseAgainst', type: 'textarea', label: 'Strongest case against' },
    { name: 'companySays', type: 'textarea', label: 'What the company says' },
    { name: 'notesForReaders', type: 'textarea', label: 'Notes for readers' },
    { name: 'whatWouldChange', type: 'textarea', label: 'What would change this verdict' },
    {
      name: 'sourceStats',
      type: 'group',
      label: 'Source counts',
      admin: { description: 'From the summary block; the importer checks them against the sources table.' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'total', type: 'number', admin: { width: '25%' } },
            { name: 'primary', type: 'number', admin: { width: '25%' } },
            { name: 'readInFull', type: 'number', label: 'Read in full', admin: { width: '25%' } },
            { name: 'partial', type: 'number', admin: { width: '25%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'rtmResearch', type: 'number', label: 'RTM research', admin: { width: '33%' } },
            { name: 'singleSource', type: 'number', label: 'Single source', admin: { width: '33%' } },
            { name: 'needsConfirmation', type: 'number', label: 'Needs confirmation', admin: { width: '34%' } },
          ],
        },
      ],
    },
    {
      name: 'sources',
      type: 'array',
      admin: { description: 'The sources table. Ids (S1, S2…) are what the findings cite.' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'sid', type: 'text', label: 'Id', admin: { width: '10%' }, required: true },
            { name: 'label', type: 'text', admin: { width: '45%' }, required: true },
            { name: 'url', type: 'text', admin: { width: '45%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'publisher', type: 'text', admin: { width: '25%' } },
            { name: 'type', type: 'text', admin: { width: '20%' } },
            { name: 'published', type: 'text', admin: { description: 'As shown by the source, or "No date shown".', width: '20%' } },
            { name: 'howRead', type: 'text', label: 'How read', admin: { width: '20%' } },
            { name: 'status', type: 'text', admin: { width: '15%' } },
          ],
        },
      ],
    },
    {
      name: 'integrityRecord',
      type: 'textarea',
      admin: { description: 'Method, dates, right of reply, conflict of interest, corrections, checklist and search sweep. Shown under a collapsed "Integrity record" heading.' },
    },
    {
      name: 'disclaimer',
      type: 'textarea',
      admin: { description: 'Verbatim at the end of every audit.' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'rightOfReply',
          type: 'select',
          admin: { width: '40%' },
          options: [
            { label: 'Not yet sent', value: 'not-yet-sent' },
            { label: 'Sent', value: 'sent' },
            { label: 'Replied', value: 'replied' },
            { label: 'Declined', value: 'declined' },
            { label: 'No reply', value: 'no-reply' },
          ],
        },
        {
          name: 'publicationReady',
          type: 'checkbox',
          label: 'Publication ready (integrity checklist has no open item)',
          admin: { width: '60%' },
          defaultValue: false,
        },
      ],
    },
    {
      name: 'blocking',
      type: 'array',
      label: 'Blocking publication',
      admin: { description: 'Open integrity-checklist items. Internal: never shown on the page.' },
      fields: [{ name: 'item', type: 'text', required: true }],
    },
  ],
}
