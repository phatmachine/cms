# Rollback Guide

This is Docker Compose on a single VPS, not PM2 — rollback means reverting the git checkout and rebuilding the image, and/or restoring a `mongodump` archive. There is no ecosystem file, no ts-node, and nothing to reinstall on the host (all dependencies are built into the Docker image).

## Decide what actually needs reverting

- **Code only, no content changes since**: just roll back the image (Phase 1).
- **Content was replaced/updated** (e.g. via the seed script) **and it's wrong**: restore from the backup taken before that operation (Phase 2). If you didn't take one first, that's the mistake to fix going forward — see the main SKILL.md's "Updating content" section, which requires a backup before any destructive run.

## Phase 1: Roll back code

```bash
ssh root@72.62.1.241 "cd /docker/rethinkthemachine && git log --oneline -10"   # find the last known-good commit
ssh root@72.62.1.241 "cd /docker/rethinkthemachine && git status"             # confirm docker-compose.yml's local edits are still intact (they should be — commits don't touch it)
ssh root@72.62.1.241 "cd /docker/rethinkthemachine && git checkout <good-commit-sha>"
ssh root@72.62.1.241 "cd /docker/rethinkthemachine && docker compose build payload"
ssh root@72.62.1.241 "cd /docker/rethinkthemachine && docker compose up -d payload"
```

Afterward, get back onto a branch (`git checkout main`) once you've either fixed forward or are ready to redeploy — don't leave the checkout in detached HEAD indefinitely.

## Phase 2: Restore database from backup

```bash
# Copy the backup archive onto the VPS if it isn't already there
scp ./rethinkthemachine-<timestamp>.archive.gz root@72.62.1.241:/root/backups/

ssh root@72.62.1.241 "docker cp /root/backups/rethinkthemachine-<timestamp>.archive.gz rethinkthemachine-mongo-1:/tmp/restore.archive.gz"
ssh root@72.62.1.241 "docker exec rethinkthemachine-mongo-1 mongorestore --uri='mongodb://localhost:27017/rethinkthemachine?replicaSet=rs0' --archive=/tmp/restore.archive.gz --gzip --drop"
```

`--drop` removes each collection in the archive before restoring it — this is what makes it an actual rollback rather than a merge. Collections not present in the archive are left alone.

Then restart payload to clear any stale in-memory cache from before the restore:

```bash
ssh root@72.62.1.241 "cd /docker/rethinkthemachine && docker compose restart payload"
```

## Verify

Same as the main SKILL.md's "Post-deploy verification" — check response headers aren't showing a stale static prerender, load the homepage/`/posts`/`/contact`, check `docker logs rethinkthemachine-payload-1 --tail 30` for errors, and spot-check document counts:

```bash
ssh root@72.62.1.241 "docker exec rethinkthemachine-mongo-1 mongosh --quiet 'mongodb://localhost:27017/rethinkthemachine?replicaSet=rs0' --eval '
[\"pages\",\"posts\",\"media\",\"users\"].forEach(c => print(c + \": \" + db.getCollection(c).countDocuments()));
'"
```

## If Mongo itself won't come up as PRIMARY after a restore or rollback

This is the replica-set-identity issue described in the main SKILL.md — it's about container hostnames, unrelated to the actual data. Fix:

```bash
ssh root@72.62.1.241 "docker exec rethinkthemachine-mongo-1 mongosh --quiet --eval 'var cfg = rs.conf(); cfg.members[0].host = \"mongo:27017\"; cfg.version += 1; printjson(rs.reconfig(cfg, {force: true}));'"
```
