# Environment Variables

Production's `.env` lives at `/docker/rethinkthemachine/.env` on the VPS (gitignored, never committed). It is **not** a MongoDB Atlas setup and does **not** need an Anthropic API key.

```env
DATABASE_URI=mongodb://mongo:27017/rethinkthemachine?replicaSet=rs0
PAYLOAD_SECRET=<random string>
NEXT_PUBLIC_SERVER_URL=https://rethinkthemachine.com
CRON_SECRET=<random string>
PREVIEW_SECRET=<random string>
```

Notes:

- `mongo` in the connection string is the Compose service name, resolved via Docker's internal DNS on the `internal` network — it is **not** `localhost` and not a remote host.
- `?replicaSet=rs0` is required; the `mongo` service runs with `--replSet rs0 --bind_ip_all`. See the main SKILL.md "Known gotchas" section if this ever breaks after a container recreation.
- `ANTHROPIC_API_KEY` is not set and not required. The `@ai-stack/payloadcms` plugin (which would use it) is currently **disabled** in `src/plugins.ts` per project history ("broken package publish blocks production builds") — don't add the key expecting it to enable anything.
- Local development is different: per `CLAUDE.md`, omitting `DATABASE_URI` entirely makes `src/getDatabaseUri.ts` spin up an ephemeral in-memory MongoDB automatically. This only applies to local dev, not production.

## Checking what's actually configured

```bash
ssh root@72.62.1.241 "cat /docker/rethinkthemachine/.env"
```

## Changing an env var

Edit the file directly over SSH, then recreate the payload service so it picks up the change:

```bash
ssh root@72.62.1.241 "cd /docker/rethinkthemachine && docker compose up -d payload"
```

(`docker compose up -d` re-reads `env_file` on recreation; a plain restart does not.)
