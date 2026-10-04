---
name: rethinkthemachine-deploy
description: Deploy rethinkthemachine.com (Payload CMS + Next.js) to its Hostinger VPS via Docker Compose, and update production content through Payload's Local API. Use when: deploying code changes, updating/replacing production content, checking on production health, or recovering from a broken deploy. Every command here was actually run and verified against the live server — not template boilerplate.
---

# Rethinkthemachine VPS Deployment

Deploy rethinkthemachine.com (Payload 3 + Next.js 16 + MongoDB) to its Hostinger VPS. This runs entirely in **Docker Compose** — there is no PM2, no MongoDB Atlas, and no CI/CD. Every command below was executed and verified against the live server on 2026-08-29.

## Infrastructure facts

| Thing | Value |
|---|---|
| GitHub repo | `https://github.com/phatmachine/cms.git` (branch `main`) — **not** `phatmachine/rethinkthemachine` |
| VPS | Hostinger VM id `1612559`, `srv1612559.hstgr.cloud`, IP `72.62.1.241`, PTR `rethinkthemachine.com` |
| SSH | `ssh root@72.62.1.241` (key `claude-code-deploy` is registered on the Hostinger account and attached to this VM) |
| Docker Compose project | `rethinkthemachine`, at `/docker/rethinkthemachine/` on the VPS — this directory **is a live git checkout** of the repo above |
| Services | `payload` (built from the repo's `Dockerfile`) and `mongo` (`mongo:7`, single-node replica set `rs0`) |
| Domain routing | Traefik (separate `traefik-5sny` compose project), via labels on the `payload` service — `Host(\`rethinkthemachine.com\`) \|\| Host(\`www.rethinkthemachine.com\`)` |
| Persistent volumes | `mongo-data:/data/db` and `media-uploads:/app/media` (the second one we added — see "Media storage" below) |
| Admin login | Real admin exists in production (`mark@thecode.co.nz`); there is no known password to hand to a script, so HTTP-based auth is not viable for automation — see "Updating content" |

**Critical**: `/docker/rethinkthemachine/docker-compose.yml` on the VPS is a **hand-tuned production file** (Traefik labels, replica-set command, two custom networks) that is *different* from the simpler `docker-compose.yml` committed in the repo. Never redeploy it from a bare GitHub URL or overwrite it with the repo's copy — that would drop Traefik routing and the Mongo replica set flag. Edit it in place over SSH if it ever needs to change, and diff before/after.

## Standard code deploy (no content changes)

```bash
ssh root@72.62.1.241 "cd /docker/rethinkthemachine && git status"   # check for local, uncommitted compose-file edits first
ssh root@72.62.1.241 "cd /docker/rethinkthemachine && git fetch origin && git pull --ff-only origin main"
ssh root@72.62.1.241 "cd /docker/rethinkthemachine && docker compose build payload"   # rebuilds the image; running containers are untouched until the next line
ssh root@72.62.1.241 "cd /docker/rethinkthemachine && docker compose up -d payload"   # swaps in the new image; mongo is untouched
```

Then verify (see "Post-deploy verification" below). A build typically takes under a minute since Docker layer caching carries over `npm ci` between builds.

## Updating / replacing production content

There is no way to log into the admin panel from a script (the real password is unknown, and you should not reset it). Instead, run Payload's **Local API** directly, which bypasses HTTP auth entirely and is exactly what `src/endpoints/seed/index.ts`'s `seed()` function is built for.

The problem: the *runtime* `payload` image (`rethinkthemachine-payload`) is a pruned Next.js standalone build — it has `node_modules` but no `src/` and no Payload CLI, so you can't run scripts inside the container that's actually serving traffic. Instead, build the Dockerfile's intermediate `builder` stage, which has full source + devDependencies + the Payload CLI, and run a one-off container from it:

```bash
# 1. Build the builder-stage image (fast — shares cached layers with the runtime build)
ssh root@72.62.1.241 "cd /docker/rethinkthemachine && docker build --target builder -t rtm-seed-runner:latest ."

# 2. Write a small script that runs the real seed() function via Local API
ssh root@72.62.1.241 "cat > /tmp/run-seed.mjs <<'EOF'
import { createLocalReq, getPayload } from 'payload'
import config from '/app/src/payload.config.ts'
import { seed } from '/app/src/endpoints/seed/index.ts'

const payload = await getPayload({ config })
const req = await createLocalReq({}, payload)
await seed({ payload, req })
console.log('SEED_COMPLETE')
process.exit(0)
EOF"

# 3. Run it, attached to the compose project's internal network, with the SAME env
#    file and the SAME persistent media volume the real app uses.
ssh root@72.62.1.241 "cd /docker/rethinkthemachine && docker run --rm \
  --network rethinkthemachine_internal \
  --env-file .env \
  -v rethinkthemachine_media-uploads:/app/media \
  -v /tmp/run-seed.mjs:/app/run-seed.mjs \
  rtm-seed-runner:latest node_modules/.bin/payload run /app/run-seed.mjs"
```

Notes:
- Node 22's native TypeScript support lets `payload run` import `.ts` files directly (config, seed script, and their relative imports) — no build step needed for this.
- **Any `payload.update`/`payload.create` on `pages` or `posts` will crash the whole script** unless you pass `context: { disableRevalidate: true }` to `createLocalReq`. Their `afterChange` hooks call Next's `revalidatePath`, which throws `Invariant: static generation store missing` outside a real HTTP request context (a bare `payload run` script isn't one) — and that throw happens *inside* the update call, so the change doesn't persist either. Always write `createLocalReq({ context: { disableRevalidate: true } }, payload)` for anything touching Pages/Posts, not just the full seed script. `docker compose restart payload` afterward as usual to clear the resulting stale cache.
- **You must mount `rethinkthemachine_media-uploads` at `/app/media`** in the one-off container, or every uploaded file the script creates will be written to that ephemeral container's own filesystem and vanish the moment it exits (`--rm`). This is exactly what happened the first time and caused every seeded photo to 404 until it was fixed.
- Any script you run this way that calls `payload.updateGlobal`/`payload.create` with `context: { disableRevalidate: true }` (as the seed script does, on purpose, to avoid hitting revalidation webhooks during a CLI run) will leave the *live* `payload` container's in-memory Next.js cache stale. **Restart the payload container afterward**: `docker compose restart payload`. This clears `unstable_cache` state, which lives only in process memory (there's no Redis or other external cache store here).
- Before running anything destructive against production data, take a backup — see below. `seed()` specifically wipes and recreates `categories`, `media`, `pages`, `posts`, `slides`, `forms`, `form-submissions`, and `search`. It does **not** touch the `users` collection in bulk (only deletes a specific `demo-author@example.com` row), so real admin logins survive.
- **After any one-off container writes to the media volume, fix ownership**: `docker exec -u root rethinkthemachine-payload-1 chown -R nextjs:nodejs /app/media`. The one-off container runs as root by default, so any files/directories it creates on that volume end up root-owned — and the real `payload` container runs as the unprivileged `nextjs` user, which can then read those files but not write new ones (admin-panel uploads fail with `EACCES`). This bit us the first time the volume was created and needed fixing after the fact — see "Media uploads fail with EACCES" in troubleshooting.md.

## Backups

```bash
ssh root@72.62.1.241 "docker exec rethinkthemachine-mongo-1 mongodump --uri='mongodb://localhost:27017/rethinkthemachine?replicaSet=rs0' --archive=/tmp/backup.archive --gzip && docker cp rethinkthemachine-mongo-1:/tmp/backup.archive /root/backups/rethinkthemachine-$(date +%Y%m%d-%H%M%S).archive.gz"
```
Also `scp` the resulting file to your own machine — don't rely on VPS disk alone. Restore with:
```bash
docker cp <local-file> rethinkthemachine-mongo-1:/tmp/restore.archive.gz
docker exec rethinkthemachine-mongo-1 mongorestore --uri='mongodb://localhost:27017/rethinkthemachine?replicaSet=rs0' --archive=/tmp/restore.archive.gz --gzip --drop
```

Check what's actually in production before deciding whether a destructive operation is safe:
```bash
ssh root@72.62.1.241 "docker exec rethinkthemachine-mongo-1 mongosh --quiet 'mongodb://localhost:27017/rethinkthemachine?replicaSet=rs0' --eval '
[\"users\",\"pages\",\"posts\",\"media\",\"form-submissions\"].forEach(c => print(c + \": \" + db.getCollection(c).countDocuments()));
'"
```

## Known gotchas (all hit and fixed on 2026-08-29)

### 1. Mongo replica set breaks whenever the mongo container is recreated

This is a single-node "replica set" (required because Payload/Mongoose use transactions). If it was ever initiated using the container's own ephemeral hostname instead of the stable Compose service name, recreating the container orphans it: it no longer recognizes itself as a member, and refuses reads/writes (`node is not in primary or recovering state`). **No data is lost** — the volume persists — it's purely an identity mismatch. Fix (already applied — the member is now `mongo:27017`, which should survive future recreations):

```bash
docker exec rethinkthemachine-mongo-1 mongosh --quiet --eval 'var cfg = rs.conf(); cfg.members[0].host = "mongo:27017"; cfg.version += 1; printjson(rs.reconfig(cfg, {force: true}));'
```
Verify with: `docker exec rethinkthemachine-mongo-1 mongosh --quiet --eval 'print(rs.status().members[0].stateStr)'` — want `PRIMARY`.

### 2. Media uploads had no persistent volume

Payload's Media collection uses local disk storage at `/app/media` (the collection slug, resolved relative to `process.cwd()`) with no cloud storage adapter configured. The original compose file only persisted `mongo-data` — meaning **every uploaded file, ever, including real admin uploads, lived only in that one container's writable layer** and would be lost on the next `docker compose up -d payload`. Fixed by adding `media-uploads:/app/media` as a named volume on the `payload` service (mirroring `mongo-data`). If you ever recreate the compose file from scratch, make sure this volume survives.

### 3. Media uploads fail with `EACCES` after the volume is (re)created

The `payload` container runs as an unprivileged `nextjs` user, but Docker creates a fresh named volume owned by `root:root` — and it stays root-owned unless something explicitly chowns it, which nothing does by default. Symptom: admin-panel uploads fail (`POST /api/media` returns 400, `{"errors":[{"message":"There was a problem while uploading the file."}]}`), while *reading* existing media works fine (browsing, thumbnails, etc.) since `nextjs` has read access. Check `docker logs rethinkthemachine-payload-1` for the real error — it'll show `EACCES: permission denied, open 'media/<filename>'`. Fix:

```bash
docker exec -u root rethinkthemachine-payload-1 chown -R nextjs:nodejs /app/media
```

This will need re-running any time the volume is freshly created or something else (e.g. a root-run one-off container) writes into it directly.

### 4. The bare `/` route can get frozen as a stale static build-time snapshot

`src/app/(frontend)/page.tsx` re-exports the `[slug]/page.tsx` component rather than defining its own. In Next.js 16, that indirection can prevent the `draftMode()` call inside the shared component from being recognized as a dynamic-rendering trigger for *this specific route* — so Next statically prerenders `/` at build time, when the build's ephemeral in-memory database is empty, and serves that frozen fallback (`Cache-Control: s-maxage=31536000`) to every real visitor forever, regardless of what's actually in the database. Symptom: homepage shows the generic "Payload Website Template" content no matter what you seed. Fixed with an explicit `export const dynamic = 'force-dynamic'` in that file (already committed) — **do not remove it**, and if this file is ever refactored, keep that export.

## Post-deploy verification

```bash
curl -sI https://rethinkthemachine.com/ | grep -iE "cache-control|x-nextjs"   # should NOT show x-nextjs-prerender / long s-maxage
curl -s https://rethinkthemachine.com/ -o /tmp/live.html -w "HTTP %{http_code}\n"
ssh root@72.62.1.241 "docker logs rethinkthemachine-payload-1 --tail 30"
ssh root@72.62.1.241 "docker compose -f /docker/rethinkthemachine/docker-compose.yml ps"
```
Then actually load the homepage, `/posts`, and `/contact` in a browser (or headless Chromium) and check the console for errors — a 200 status code doesn't guarantee images or data actually rendered.

## References

- [Rollback](./references/rollback-guide.md)
- [Troubleshooting](./references/troubleshooting.md)
- [Collections guide](./references/collections-guide.md)
- [Environment variables](./references/environment-setup.md)
- [Pre-deployment checklist](./references/pre-deployment-checklist.md)
- [Schema/data changes](./references/data-migrations.md)
