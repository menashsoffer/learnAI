# Source & attribution

- Skill: `impeccable` v4.3.1 (engine binary 0.1.5)
- Upstream: https://github.com/pbakaus/impeccable (commit `f2c7051853848826aac2f4646581d62a732155ad`)
- License: Apache 2.0 (see `LICENSE`, third-party credits in `NOTICE.md`)

Installed with:

```
npx skills add pbakaus/impeccable -a claude-code --copy -y
```

## Variant correction

The CLI installed the repo's GENERIC variant (`.agents/skills/impeccable`),
whose instructions reference `.agents/skills/impeccable/scripts/...` paths that
do not exist here and use a `$impeccable` command prefix. This folder was
replaced with the repo's Claude-specific variant (`.claude/skills/impeccable`),
which matches the install path and adds `user-invocable: true` plus an
`argument-hint`, so the verbs are reachable as `/impeccable <verb>`.
Re-check this after any `skills update`.

## Runtime behaviour worth knowing

- This skill is an engine, not just guidance. `scripts/impeccable` is a POSIX
  launcher; no binary ships in the repo.
- On first use it downloads a ~16 MB platform binary from
  `https://github.com/pbakaus/impeccable/releases/download` and caches it in
  `~/.impeccable/bin/<version>/` — outside this repo, so nothing to gitignore.
- The download fails closed: it is verified against a `.sha256` sidecar and
  refuses to exec if the sidecar cannot be fetched or no sha256 tool exists.
- The SKILL.md declares `allowed-tools: Bash(npx impeccable *)` and
  `Bash(.agent/skills/impeccable/scripts/impeccable *)`, i.e. a standing
  pre-approval to run those commands without a permission prompt.
- Verified working here: `scripts/impeccable engine-probe` → `impeccable-engine 0.1.5`.
