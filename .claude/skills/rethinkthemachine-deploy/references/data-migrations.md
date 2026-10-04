# Schema & Data Changes

There is no `src/scripts/migrations/` directory, no `npm run migrate:<name>` scripts, and no `getPayloadHMS` helper in this project — those were fabricated in an earlier, inaccurate version of this skill. This is MongoDB (schemaless at the DB level), so most "migrations" here are either nothing at all, or a one-off script run the same way the seed script runs.

## When you actually need a script

- Backfilling a new **required** field on existing documents (optional fields need nothing — see `collections-guide.md`)
- Bulk content transformations (renaming/restructuring data across many documents)
- Anything the admin UI can't reasonably do by hand across every affected document

## How to actually run one against production

Same mechanism as running the seed script — see the main SKILL.md's "Updating / replacing production content" section in full. Summary:

1. `docker build --target builder -t rtm-seed-runner:latest .` on the VPS, in `/docker/rethinkthemachine` (the `builder` stage has full source + Payload CLI; the runtime `payload` image does not).
2. Write your script as plain `.mjs`, importing `getPayload`/`createLocalReq` from `payload` and your config from `/app/src/payload.config.ts` directly (Node 22 handles the `.ts` import natively via `payload run`).
3. Run it with `docker run --rm --network rethinkthemachine_internal --env-file .env -v rethinkthemachine_media-uploads:/app/media -v /path/to/script.mjs:/app/script.mjs rtm-seed-runner:latest node_modules/.bin/payload run /app/script.mjs`.
4. `docker compose restart payload` afterward if the script updated anything with `disableRevalidate` (or to be safe, always).

## Example script shape

```js
import { createLocalReq, getPayload } from 'payload'
import config from '/app/src/payload.config.ts'

const payload = await getPayload({ config })
const req = await createLocalReq({}, payload)

const { docs } = await payload.find({ collection: 'posts', where: { featured: { exists: false } }, req })

for (const doc of docs) {
  await payload.update({ collection: 'posts', id: doc.id, data: { featured: false }, req })
}

console.log(`Updated ${docs.length} posts`)
process.exit(0)
```

Local API calls default to `overrideAccess: true`, so access-control rules (`authenticated`, `authenticatedOrPublished`, etc.) don't apply here — be deliberate about `where` filters.

## Before running anything destructive

1. **Back up production first** — see the main SKILL.md's "Backups" section. Non-negotiable.
2. Check real document counts for the collections you're about to touch, so you know what "before" looks like:

   ```bash
   docker exec rethinkthemachine-mongo-1 mongosh --quiet 'mongodb://localhost:27017/rethinkthemachine?replicaSet=rs0' --eval 'print(db.getCollection("posts").countDocuments())'
   ```

3. Test the script's logic against a local instance first if practical — `npm run dev` locally uses an ephemeral in-memory MongoDB when `DATABASE_URI` is unset (see `CLAUDE.md`), so you can seed/mutate freely there with zero production risk.
4. Confirm the specific documents affected, not just a collection-wide assumption — `payload.find` with a narrow `where` beats iterating everything and hoping a condition inside the loop is right.

## After running

- Spot-check a few affected documents in the admin panel (`https://rethinkthemachine.com/admin`).
- Re-run the same count query and confirm the numbers make sense.
- Restart `payload` if caching could be an issue (see `troubleshooting.md`).
