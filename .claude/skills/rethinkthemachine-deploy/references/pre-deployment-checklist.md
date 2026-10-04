# Pre-Deployment Checklist

## Code

- [ ] Changes committed and pushed to `origin/main` on `https://github.com/phatmachine/cms.git`
- [ ] `npx tsc --noEmit` passes (this repo has no dedicated `type-check` script)
- [ ] `npm run lint` passes
- [ ] `npm run build` succeeds locally
- [ ] If any collection/block schema changed: `npm run generate:types` was run and `src/payload-types.ts` is committed

## If this deploy touches content, not just code

- [ ] Checked what's actually in the production collections you're about to affect (see main SKILL.md's "Backups" section for the count-query snippet)
- [ ] Taken a `mongodump` backup and copied it off the VPS to your own machine
- [ ] Confirmed the operation's actual scope — e.g. the seed script wipes `pages`, `posts`, `media`, `categories`, `slides`, `forms`, `form-submissions`, `search` (not `users`)

## VPS state

- [ ] `git status` on `/docker/rethinkthemachine` on the VPS shows only the expected local, uncommitted `docker-compose.yml` customization (Traefik labels, replica set command) — nothing else
- [ ] Mongo replica set is healthy before you start: `docker exec rethinkthemachine-mongo-1 mongosh --quiet --eval 'print(rs.status().members[0].stateStr)'` should print `PRIMARY`
- [ ] Disk space is fine: `df -h` (the `rtm-seed-runner` builder-stage image is ~3.5GB if you've built it before — remove with `docker image rm rtm-seed-runner` once done with content work)

## After deploying

- [ ] `curl -sI https://rethinkthemachine.com/` doesn't show `X-Nextjs-Prerender` / a huge `s-maxage` (see `troubleshooting.md` if it does)
- [ ] Homepage, `/posts`, and `/contact` load correctly in an actual browser — check the console for errors, not just the HTTP status
- [ ] `docker logs rethinkthemachine-payload-1 --tail 30` shows no errors
- [ ] If content was updated: `docker compose restart payload` was run afterward to clear stale cache
