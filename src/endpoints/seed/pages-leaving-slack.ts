import type { RequiredDataFromCollectionSlug } from 'payload'
import type { Media } from '@/payload-types'

import { platformExitPage } from './platform-exit-template'

type Args = {
  heroImages: Media[]
  stepImage: Media
}

/**
 * Worked example of the "platform exit" template for a commercial
 * (B2B/enterprise SaaS) application, as opposed to `leaving-gmail`'s
 * consumer one. See `platform-exit-template.ts` for the reusable factory
 * this is built from.
 */
export const leavingSlack: (args: Args) => RequiredDataFromCollectionSlug<'pages'> = ({
  heroImages,
  stepImage,
}) =>
  platformExitPage({
    slug: 'leaving-slack',
    category: 'Team chat',
    platformName: 'Slack',
    protocolNumber: '002',

    heroImages,
    heroSubhead:
      "Slack keeps a permanent, searchable record of everything your team says, retained under whatever policy your admin — or Slack's own defaults — set for you. Here is what changes when the record is yours to keep.",
    metaDescription:
      'Why Slack costs more than it looks like, and two self-hostable, open alternatives — with a step-by-step migration guide.',
    metaLine: 'Est. 2026 / Attention & Sovereignty // One afternoon / No data lost',
    sidebarLabel: 'Exit protocol no. 002 // Team chat // Coords: 34.0522° N, 118.2437° W',

    thesisLabel: 'The ledger [01]',
    thesisStatement:
      'Team chat was never just chat — it was priced in a permanent transcript, and the archive is ',
    thesisEmphasis: 'a working record of how your company actually thinks',
    thesisAfter: '.',

    concernsEyebrow: 'What it costs [02]',
    concernsHeading: 'Three concerns worth the afternoon',
    concerns: [
      {
        title: 'Every channel is a permanent transcript',
        description:
          'Deleted messages often survive in exports, audit logs, and eDiscovery holds long after they vanish from your view, under retention rules an admin set — not you.',
      },
      {
        title: 'One workspace, one point of failure',
        description:
          'Decisions, files, and institutional memory concentrate in a single account. Losing access — an outage, a lapsed admin, a billing dispute — cascades across every project at once.',
      },
      {
        title: 'Seats are priced per person, forever',
        description:
          'The bill scales with headcount and rarely comes back down on its own; a growing team is a recurring cost with no ceiling in sight.',
      },
    ],

    alternativesEyebrow: 'Two ways out [03]',
    alternativesHeading: 'Two ways out of Slack',
    alternativesIntro: 'Two, not ten. Ranked by how much friction you are willing to accept.',
    alternatives: [
      {
        name: 'Element',
        badge: 'editor-pick',
        tagline: 'Decentralized chat on an open protocol.',
        description:
          'Built on Matrix, an open messaging standard with end-to-end encryption and no single company able to cut off your access. Federation adds real setup complexity most teams have never had to think about.',
        price: 'Free, from €4.50/user/mo hosted',
        url: 'https://element.io',
      },
      {
        name: 'Mattermost',
        badge: 'open-source',
        tagline: 'Open-source, self-hosted team chat.',
        description:
          "Runs on infrastructure your team controls, with channels and threads close enough to Slack that the switch barely registers. Self-hosting means your admin now owns the security work Slack used to do for you.",
        price: 'Free, self-hosted / from $10/user/mo cloud',
        url: 'https://mattermost.com',
      },
    ],

    comparisonEyebrow: 'Side by side [04]',
    comparisonHeading: 'Slack against the alternatives',
    comparisonColumns: [
      { label: 'Slack' },
      { label: 'Element', isFeatured: true },
      { label: 'Mattermost' },
    ],
    comparisonRows: [
      {
        feature: 'End-to-end encryption',
        cells: [{ status: 'no' }, { status: 'yes' }, { status: 'partial', note: 'Self-managed only' }],
      },
      {
        feature: 'Self-hosted option',
        cells: [{ status: 'no' }, { status: 'yes' }, { status: 'yes' }],
      },
      {
        feature: 'Retention you control',
        cells: [{ status: 'partial', note: 'Paid tiers only' }, { status: 'yes' }, { status: 'yes' }],
      },
      {
        feature: 'Open source',
        cells: [{ status: 'no' }, { status: 'yes' }, { status: 'yes' }],
      },
    ],

    migrationEyebrow: 'The move [05]',
    migrationHeading: 'Moving a workspace without losing anything',
    migrationIntro: 'Budget an afternoon. Nothing here needs to happen all at once.',
    stepImage,
    steps: [
      {
        title: 'Export the workspace',
        description:
          "Slack's data export bundles every channel, file, and message your plan allows into a single archive most alternatives can import directly. Budget an afternoon for a mid-size workspace.",
      },
      {
        title: "Bridge, don't switch cold",
        description:
          'Run the new workspace alongside Slack for a few weeks with a bridge bot mirroring key channels, so nothing said in either place gets missed during the handoff.',
      },
      {
        title: 'Move the integrations first',
        description:
          'Rebuild the bots and workflow automations your team actually uses — standup reminders, CI notifications, ticket links — before daily habits depend on them living somewhere else.',
      },
      {
        title: 'Retire the old workspace',
        description:
          'Once the new workspace has carried a full sprint on its own, downgrade Slack to a read-only archive rather than paying for seats nobody opens.',
      },
    ],
  })
