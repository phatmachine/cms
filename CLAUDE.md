# Payload CMS subproject

Stack: Payload 3.86 + Next.js 16.2 (Turbopack, default in Next 16) + MongoDB, TypeScript, ESM (`"type": "module"`).

Before writing any Next.js-specific code (config, routing, `next.config.ts`), read the
relevant guide in `node_modules/next/dist/docs/` — this pins a version newer than most
training data and the App Router/Turbopack conventions have changed. See the root
`AGENTS.md` for why.

## Running locally

- `npm run dev` — starts on **port 3001**, not 3000. Port 3000 is used by the root
  marketing site (`c:\dev\rethinkthemachine`), so this project intentionally uses 3001.
- First run creates the initial admin user via the `/admin` panel.

## Database

No local MongoDB or Docker install is required for development. `src/getDatabaseUri.ts`
starts an in-memory MongoDB replica set (`mongodb-memory-server`) automatically when
`DATABASE_URI` is unset, and `payload.config.ts` awaits it at config-load time (top-level
await). Data does not persist across restarts in this mode. For staging/production, set
`DATABASE_URI` to a real MongoDB connection string in `.env`.

## Collections

Defined in `src/collections/`. After adding/changing fields, regenerate types:

```
npm run generate:types
```

## AI (Claude/Anthropic) in the admin panel

`@ai-stack/payloadcms` (community plugin, config in `src/plugins.ts`) adds AI-assisted
content generation inside the admin UI. It auto-detects providers from env vars — set
`ANTHROPIC_API_KEY` in `.env` to make Claude available as a model for enabled
collections. Currently enabled for the `media` collection (e.g. alt-text generation).
Add more collections by adding `{ <slug>: true }` to the plugin config.

This is separate from using Claude Code itself to build out this project — no key is
needed for that.
