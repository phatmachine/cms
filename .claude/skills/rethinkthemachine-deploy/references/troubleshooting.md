# Troubleshooting

Real issues hit while deploying this project, with the actual diagnosis and fix. This is Docker Compose — there is no PM2, so `pm2 logs`/`pm2 restart` etc. do not apply anywhere in this stack. Use `docker logs <container>` and `docker compose` instead.

## Homepage shows old/placeholder content no matter what you seed

**Symptom**: `curl -sI https://rethinkthemachine.com/` shows `X-Nextjs-Prerender: 1` and a huge `s-maxage`. The page never changes even after updating the database and restarting.

**Cause**: `src/app/(frontend)/page.tsx` re-exporting the `[slug]/page.tsx` component instead of defining its own page. Next.js 16 statically froze `/` at build time (when the build's ephemeral database is empty), and kept serving that frozen HTML indefinitely.

**Fix**: confirm `export const dynamic = 'force-dynamic'` is present in `src/app/(frontend)/page.tsx` (it was added and committed on 2026-08-29 — if it's missing, someone removed it). If you suspect this is happening on some *other* route too, check its response headers the same way; the fix is the same route-segment-config export.

## Mongo refuses reads/writes: "node is not in primary or recovering state"

**Cause**: the replica set's single member is registered under a hostname that no longer exists — almost always because the `mongo` container got recreated (a new container gets a new random hostname unless `hostname:` is set or the replset was initiated against the stable service name). Check what it thinks its member list is:

```bash
docker exec rethinkthemachine-mongo-1 mongosh --quiet local --eval 'db.system.replset.find().toArray()'
```

If `members[0].host` isn't `mongo:27017`, that's the problem. **The data is not affected** — this is purely replica-set membership metadata. Fix:

```bash
docker exec rethinkthemachine-mongo-1 mongosh --quiet --eval 'var cfg = rs.conf(); cfg.members[0].host = "mongo:27017"; cfg.version += 1; printjson(rs.reconfig(cfg, {force: true}));'
```

Verify: `docker exec rethinkthemachine-mongo-1 mongosh --quiet --eval 'print(rs.status().members[0].stateStr)'` should print `PRIMARY`.

## Uploaded/seeded images 404 at `/api/media/file/<name>`

**Cause**: no persistent volume for Payload's local upload storage (`/app/media` in the container). If a file was created by a container that has since been removed (e.g. a one-off `docker run --rm` used to run a script), the bytes are gone even though the MongoDB document describing it still exists. Confirm:

```bash
docker exec rethinkthemachine-payload-1 ls -la /app/media/     # does the file actually exist here?
docker exec rethinkthemachine-mongo-1 mongosh --quiet 'mongodb://localhost:27017/rethinkthemachine?replicaSet=rs0' --eval 'db.media.find({filename: "yourfile.jpg"})'   # does the DB doc match?
```

If the DB doc exists but the file doesn't: the fix is structural, not a retry — make sure `docker-compose.yml` has `media-uploads:/app/media` on the `payload` service (it should, as of 2026-08-29), and make sure any one-off container used to create/modify media also mounts `rethinkthemachine_media-uploads:/app/media`, not just the app container.

If the file exists on disk but still 404s: it may just be a startup race right after a container recreation — retry once after a few seconds before assuming something is actually broken.

## Admin-panel uploads fail: "There was a problem while uploading the file"

**Symptom**: `POST /api/media` (or `PATCH` on an existing doc with a new file) returns 400 with that generic message. Browsing existing media, thumbnails, and downloads all work fine — it's specifically new writes that fail.

**Diagnosis**:

```bash
docker logs rethinkthemachine-payload-1 --tail 30
```

Look for `EACCES: permission denied, open 'media/<filename>'`.

**Cause**: the `media-uploads` named volume is owned by `root:root` (Docker's default when a volume is first created/written), but the `payload` container runs as the unprivileged `nextjs` user — which can read existing files (world-readable) but can't create new ones in a directory it doesn't have write access to.

**Fix**:

```bash
docker exec -u root rethinkthemachine-payload-1 chown -R nextjs:nodejs /app/media
```

Then retest an actual upload through the admin UI — don't just confirm the list view loads, that only proves reads work.

## A one-off script updating a page crashes with "static generation store missing"

**Symptom**: a `payload run` script calling `payload.update`/`payload.create` on `pages` or `posts` throws and exits non-zero, and the change doesn't persist:

```text
Error: Invariant: static generation store missing in revalidatePath /
    at revalidatePath (.../next/src/server/web/spec-extension/revalidate.ts:...)
    at revalidatePage (/app/src/collections/Pages/hooks/revalidatePage.ts:18:7)
```

**Cause**: Pages/Posts have an `afterChange` hook that calls Next's `revalidatePath`/`revalidateTag`, which only works inside a real Next.js request lifecycle. A bare `payload run` script isn't one, so the hook throws — and since it throws inside the update operation, the write gets rolled back too (check the collection afterward; it won't have your change).

**Fix**: pass revalidation-skipping context when creating the local req:

```js
const req = await createLocalReq({ context: { disableRevalidate: true } }, payload)
```

Then `docker compose restart payload` afterward to clear the stale in-memory cache, same as any other `disableRevalidate` write (see below).

## Homepage/pages look fine right after a content update, but stop matching what's actually in the database

**Cause**: `src/endpoints/seed/index.ts`'s `seed()` (and similar scripts) intentionally pass `context: { disableRevalidate: true }` on global/page mutations, to avoid triggering webhook-style revalidation during a CLI/script run. That means Next's `unstable_cache`-wrapped reads (`getCachedGlobal` for Header/Footer, and page-level caching) can keep serving what they had cached from *before* the mutation, since nothing told them to invalidate.

**Fix**: `docker compose restart payload` after running any such script. This clears all in-memory Next.js cache state, since there's no external cache store (no Redis) — it only lives in the process.

**Also watch for**: hitting the homepage (even just a status-code check) *before* seeding will itself populate the cache with pre-seed (often empty) data. If you need to verify a fresh deploy, avoid `curl`-ing the site until after seeding is complete, or restart `payload` again afterward.

## `docker run` for a one-off script can't reach Mongo

**Cause**: forgot to attach the one-off container to the Compose project's internal network.

**Fix**: add `--network rethinkthemachine_internal` to the `docker run` command. Confirm the exact network name first — it's `<project>_<network>`, so `docker network ls | grep rethink` to check if it's ever renamed.

## General diagnostics

```bash
ssh root@72.62.1.241 "docker compose -f /docker/rethinkthemachine/docker-compose.yml ps"
ssh root@72.62.1.241 "docker logs rethinkthemachine-payload-1 --tail 50"
ssh root@72.62.1.241 "docker logs rethinkthemachine-mongo-1 --tail 50"
ssh root@72.62.1.241 "df -h"   # disk space — the builder-stage image used for content scripts is ~3.5GB; clean up with `docker image rm rtm-seed-runner` when done with it
```
