---
name: rtm-audit-post
description: Turn an rtm-sovereignty-audit .md file into an "Audit" post on rethinkthemachine.com (Payload CMS) with the scorecard page: a ring graphic and verdict that show at a glance whether a service meets the Rethink the Machine standard. Use whenever the user wants to publish, import, preview, update or re-check an audit as a page or post, says "make a post from this audit", "put the Proton audit on the site", "build the audit page", or hands over a sovereignty-audit file or its YAML summary block. Not for writing the audit itself (rtm-sovereignty-audit) or for exit guides (rtm-exit-guide).
---

# RTM audit → Payload post

The audit skill (`rtm-sovereignty-audit`) writes one sourced, dated `.md` file per service and says plainly that "a separate skill turns the audit's summary block into a visual and publishes it". This is that skill. It never audits, never changes a finding, and never publishes without being asked.

## What gets built

- A post with **Post Type = Audit**, in the **Audit** category. The name is provisional: to rename it, change the category's title in Payload → Categories and the `CATEGORY` constant in `scripts/import-audits.ts` (the importer finds the category by title, and would otherwise create a second "Audit" one).
- URL `/posts/audit-[service-slug]`. Title `Sovereignty audit: [Service]`.
- The page (`src/components/Audit/`):
  1. Header: service, what it is, operator, country (with flag), what it replaces, the `takeaway` set large, the summary, the scope.
  2. **Scorecard**, the thing to get right: a six-segment ring (one segment per test, clockwise from the top; tick / hatched bar / cross / question mark for pass / flag / fail / unverified), a big "Meets our standard / with caveats / Does not meet / Fails our standard" banner, the four-step verdict scale with the current tier marked, and one line per test with its six-word headline. Each segment links to its test below.
  3. Strength of evidence strip: sources, primary, read in full, single-source, right of reply.
  4. The six tests with `[S#]` citations turned into links to the sources table, and "What a reader can do" under each flag.
  5. Strongest case against, what the company says, notes for readers, what would change the verdict.
  6. Sources table (anchors `#source-S1`…), a collapsed integrity record, the verbatim disclaimer.
  7. A banner when the re-check date has passed ("This verdict is out of date") or is within 30 days.
- Not rendered, by design: `blocking` (open integrity-checklist items). Internal notes never reach the CMS: the importer only reads the audit file.

## Inputs

The audit file: `rethink-the-machine/audits/[service-slug].md` in the claude.ai Project, or a local path, or pasted text. Never `…/internal/…-notes.md` and never `register.md`. If asked to build a page from the notes file, stop and say why.

## Workflow

Set up a task list. Run commands from the repo root.

1. **Place the file.** Save the audit verbatim as `content/audits/[service-slug].md`. Do not reflow, "fix" or tidy it. If a pasted file arrives in a chat, write it byte-for-byte.
2. **Dry run.** Nothing is written to the database.
   - bash: `DRY_RUN=1 npm run import:audits`
   - PowerShell: `$env:DRY_RUN=1; npm run import:audits`
   - Redirect to a file if output goes missing on Windows, then read it.
   - Add `AUDIT_FILES=path/to/file.md` to import one file from anywhere. (Env vars, not arguments: `payload run` swallows `--dry-run` and extra arguments.)
3. **Read the result.**
   - **ERROR** lines block the import. They mean the file does not match the audit format or contradicts itself. The common ones: the verdict is more favourable than the tests allow (the rule is applied mechanically: any FAIL is Reject, any UNVERIFIED is Not recommended (unverified), four or more FLAGs or an unmitigable FLAG on tests 2 or 4 is Not recommended); a result in the body differs from the YAML block; a date is unreadable. **Fix the audit, never the importer or the verdict.** Send it back to `rtm-sovereignty-audit` (re-check mode) rather than editing findings here.
   - **warning** lines do not block a draft, but they block publishing. They are the audit skill's own count check and checklist failing: a count in the YAML block that disagrees with the table, a source never cited, a cited id missing from the table, a finding with no citation, `publication_ready: false`, anything in `blocking`, the `[CORRECTIONS CONTACT]` placeholder still in the disclaimer. Report each one to the user.
4. **Import as a draft** (the default): `npm run import:audits`. It prints the page path and admin link. A draft is invisible to the public.
5. **Preview.** Start `npm run dev` and open the post from the admin (Preview), or `/posts/[slug]` while logged in. Use `localhost`, never `127.0.0.1` (client JS silently never runs there). Check the ring at desktop and phone width, that the citations jump to the sources table, and that no text is clipped. For a screenshot check, drive Edge with Playwright (`channel: 'msedge'`; the bundled browser is not installed), and measure overflow from element edges, because the site sets `overflow-x: clip`, which hides overflow from `scrollWidth`.
6. **Publish only when the user says so.** `PUBLISH=1 npm run import:audits` publishes a file only if it has no errors, no warnings, and `publication_ready: true`. Otherwise it imports as a draft and says why. Before publishing, remind the user of the two things the audit skill puts behind that flag that this skill cannot judge: the right of reply was sent and 14 days have passed (or a reply is recorded), and legal review of the disclaimer for each market. The `rethinkthemachine-defensible-content` skill applies to any claim about a named company.
7. **Production is a separate step.** The local database is the source of truth; content is pushed up to production afterwards. This skill never deploys. See `rethinkthemachine-deploy`.

## Re-checks and edits

- **Draft:** re-running the importer replaces the post's `audit` data from the file. Title, categories, SEO and authors are left as edited.
- **Published:** the importer **skips** it. The local DB, not the file, is the source of truth for anything published. To replace a published audit's data (a re-check, after the user agrees), first save the document's JSON to the scratchpad as a backup, then `FORCE_PUBLISHED=1 PUBLISH=1 npm run import:audits`. It will still refuse to demote a published post to a draft, and will not touch title, categories, SEO or authors.
- Verdicts expire after six months, or at once on a sale, an acquisition or new terms. The page shows the banner on its own once `recheck_by` passes; there is nothing to schedule.

## Where the data comes from

| Page element | Source in the audit file |
|---|---|
| service, what it is | `service: Verda (GPU cloud)` split into name and descriptor |
| operator, country, category, replaces | `operator`, `country`, `category`, `alternative_to` |
| verdict, unverified | `verdict` (`not-recommended-unverified` is Not recommended plus the unverified flag) |
| ring, legend, tally | `tests[]` (`result`, `headline`); the tally is recomputed and compared |
| takeaway | `takeaway` |
| dates, version | `checked`, `recheck_by`, `version` |
| evidence strip | `sources:` counts (checked against the sources table), `right_of_reply` |
| gate | `publication_ready`, `blocking` |
| summary, scope | `## Summary`, the `Scope:` line |
| tests | `### 1. Independence — PASS` … body text, `**What a reader can do:**` |
| notes | `## Strongest case against`, `## What the company says`, `## Notes for readers`, `## What would change this verdict` |
| sources table | `## Sources` |
| integrity, disclaimer | `## Integrity record`, `## Disclaimer` |

The parser is `src/utilities/auditParser.ts`; the verdict rule and the six tests are in `src/utilities/audit.ts`. Both are covered by `tests/int/audit.int.spec.ts` against a fictional service (`tests/fixtures/audit-examplemail.md`). Run `npx vitest run --config ./vitest.config.mts tests/int/audit.int.spec.ts` after any change to either. If the audit skill's file format changes, update the parser and the fixture together, then re-run the tests.

## Design rules for the template

- Colours are the brand tokens only: pass is `--rtm-teal-dark`, flag is `--rtm-accent` (hatched), fail is `--rtm-magenta`, unverified is `--rtm-umber`. The Paper register has no semantic green or red; do not add them.
- Colour is never the only signal: each result has its own glyph, and the legend repeats every result in words.
- The article wrapper keeps `bg-rtm-bg` (see the comment in `posts/[slug]/page.tsx`): the sitewide dark theme would otherwise flip the page near-black behind the scorecard colours.
- Grid column gaps are applied from `md`/`lg` up. Eleven 40px gaps do not fit a phone, and `overflow-x: clip` would hide the result rather than show it.

## Gotchas

- `payload run` exits as soon as the script module finishes evaluating: the importer must `await` its work at top level, and it swallows extra arguments and `--dry-run`. Use the env vars above.
- After changing fields in `src/collections/Posts/auditFields.ts`, run `npm run generate:types`.
- `payload run` needs the dev database. This machine runs a native MongoDB service; check it is running before assuming an in-memory fallback.
- Posts with `postType: audit` still need `content` to be optional: the validator in `Posts/index.ts` allows it for both `exitGuide` and `audit`. Keep both if that validator is edited.
