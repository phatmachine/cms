# Sovereignty audit source files

Drop the audit file written by the `rtm-sovereignty-audit` skill here, saved as
`[service-slug].md` (for example `proton-mail.md`), then:

```
DRY_RUN=1 npm run import:audits    # parse and report, write nothing
npm run import:audits              # import as a draft
PUBLISH=1 npm run import:audits    # publish files that are ready
```

(PowerShell: set the variable first, `$env:DRY_RUN=1; npm run import:audits`.)

This upserts a Post (`postType: audit`, category "Audit") per file, matched by slug
`audit-[service]`. It never deletes a post, and it never overwrites or demotes a published
post. It imports as a draft unless the file has no errors, no warnings and
`publication_ready: true`, and you asked for `PUBLISH=1`.

Only the audit file belongs here. The internal notes (`…-notes.md`) and `register.md` stay in
the claude.ai Project and must never be imported. Files starting with `_` and this README are
skipped.

The full workflow, field mapping and gotchas are in
`.claude/skills/rtm-audit-post/SKILL.md`.
