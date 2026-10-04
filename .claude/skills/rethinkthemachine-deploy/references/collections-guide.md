# Collections Guide

All collections are defined in `src/collections/`. This is MongoDB via Mongoose — there's no rigid schema enforcement at the DB level, so **adding an optional field never requires a migration**; existing documents simply don't have it until saved again. This is why `references/data-migrations.md`'s guidance differs from a SQL project.

## Real collections in this database

Confirmed live in production (`db.getCollectionNames()` equivalent) as of 2026-08-29:

`pages`, `posts`, `media`, `categories`, `slides`, `users`, `redirects`, `forms`, `form-submissions`, `search`, plus Payload's own system collections (`payload-preferences`, `payload-migrations`, `payload-jobs`, `payload-locked-documents`, `payload-kv`, and per-collection `*_versions` collections for anything with drafts enabled).

### Pages — `src/collections/Pages/index.ts`

- `title`, `slug` (via `slugField()`), `publishedAt`
- `hero` — a single object, `type` select (`highImpact`, `lowImpact`, `mediumImpact`, `nebula`, `paper`, `signalCarousel`, ...) plus fields shared/conditioned across types — see `src/heros/config.ts`
- `layout` — a `blocks` array; this is the actual page body, freely reorderable in admin. Registered blocks are listed in both `src/collections/Pages/index.ts` (schema) and `src/blocks/RenderBlocks.tsx` (rendering) — **both files must be updated together** when adding a new block type
- `meta` — SEO group (`@payloadcms/plugin-seo`)
- `carouselFeature` — sidebar group for prepping content to paste into a Carousel Slide
- Versioned with drafts (`versions.drafts.autosave`, `schedulePublish`)
- Access: `authenticatedOrPublished` (public can only see `_status: 'published'` docs)

### Posts — `src/collections/Posts/index.ts`

- `title`, `slug`, standard blog fields, `categories` relationship, SEO `meta` group
- Access: `authenticatedOrPublished`, same pattern as Pages

### Media — `src/collections/Media.ts`

- Just `alt` (required text) plus Payload's auto-managed upload fields (`filename`, `mimeType`, `filesize`, `width`, `height`, `url`, focal point)
- `upload: true` with **no custom `staticDir` and no cloud storage adapter** — files are stored locally at `/app/media` in the container (the collection slug, resolved relative to cwd). See the main SKILL.md's "Known gotchas" — this path needs the `media-uploads` volume or files vanish on container recreation
- Access: `read: () => true` (fully public)

### Users — `src/collections/Users/index.ts`

- `auth: true`, one custom field: `name`. No `roles` field — every user is effectively an equal admin
- Access: `authenticated` for everything (create/read/update/delete/admin)
- The real production account is `mark@thecode.co.nz`. A `demo-author@example.com` account also exists — it's created and deleted by the seed script and is not meaningful

### Categories — `src/collections/Categories.ts`

Simple taxonomy: `title`, `slug`. Referenced by Posts.

### Slides — `src/collections/Slides/index.ts`

Powers the `signalCarousel` hero type: `title`, `brand`, `category` (select), plus (not shown above but present) background media and a link. Access is public read, authenticated write.

### Forms / form-submissions

From `@payloadcms/plugin-form-builder`. One `forms` document exists (the contact form); `form-submissions` held 0 real documents as of 2026-08-29 — confirm this again before ever running anything destructive against it.

## Header / Footer (globals, not collections)

`src/Header/config.ts` and `src/Footer/config.ts` — single documents, not lists. Both have `afterChange` hooks (`revalidateHeader`/`revalidateFooter`) that call `revalidateTag`, skippable via `context: { disableRevalidate: true }` (see the caching gotcha in `troubleshooting.md`).

## Making schema changes

1. Edit the collection file in `src/collections/` (or block config in `src/blocks/*/config.ts`).
2. Run `npm run generate:types` locally — regenerates `src/payload-types.ts`. Commit this file; it's checked in.
3. New required fields on a collection that already has documents need either a sensible `defaultValue` or a follow-up data pass to backfill existing docs (see `data-migrations.md`) — Payload does not backfill for you.
4. Deploy the code (main SKILL.md's standard deploy). No separate "run migrations" step exists for MongoDB here — the schema is enforced by Payload's admin UI and API validation at request time, not by the database.

## Real npm scripts (package.json)

`build`, `postbuild`, `dev`, `dev:prod`, `generate:importmap`, `generate:types`, `ii`, `lint`, `lint:fix`, `payload`, `reinstall`, `start`, `test`, `test:e2e`, `test:int`. There is no `type-check`, `seed`, `ts-node`, `cache:enable`, or `profile` script — don't invoke them.
