# Dual-Trigger Docker Hub Publishing

The GitHub Actions workflow publishes on two triggers: a push to `main` publishes `:latest` (a rolling edge image), and a pushed git tag `vX.Y.Z` publishes an immutable `:vX.Y.Z`. On a tag build the version comes from the git tag itself (`github.ref_name`), not `package.json` — the tag is the single source of truth. A `test` job (typecheck + unit tests) gates both.

## Considered Options

- **Push to `main` + version read from `package.json` + `latest`** (the pattern used by sibling projects) — every merge republishes, so an unbumped push silently overwrites an existing `vX.Y.Z`. A "skip if the tag already exists" guard was considered to make version bumps the release trigger, but the git-tag model gives the same immutability without a guard and with an explicit release action.
- **GitHub Releases (`on: release: published`)** — adds changelog/release notes and a `prerelease` flag, at the cost of always cutting releases through the UI. Deferred; a plain git tag is lower ceremony and sufficient today.

## Consequences

`package.json`'s `version` is no longer what names the published image; it is kept in sync by convention (e.g. `npm version`) rather than enforced. Cutting a pinned release is a deliberate `git tag && git push`, while `:latest` always tracks `main`.
