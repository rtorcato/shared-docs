# CLAUDE.md

`@rtorcato/shared-docs` — shared data + Docusaurus helpers for the `@rtorcato/*`
docs sites. The single source of truth for the **sibling-family list** (`src/family.ts`)
that every sibling site renders in its nav, footer, and landing grid.

## Golden rule

`dist/` is **committed on purpose** (see `.gitignore`) so git-dep consumers install
prebuilt output with no build step. **After any change to `src/`, run `pnpm build`
and commit the updated `dist/`.** CI fails if `dist/` drifts from `src/`.

## Commands

- `pnpm build` — `tsc` + copy CSS to `dist/` (run before every commit that touches `src/`)
- `pnpm typecheck` — `tsc --noEmit`

## Stack

- ESM-only TypeScript library, pnpm, Node ≥22.
- Consumed two ways: git-dep (`github:rtorcato/shared-docs#v0.1.0`) and npm (`@rtorcato/shared-docs`).

## Release

Bump `version` in `package.json` → commit → `git tag vX.Y.Z && git push --tags`.
The release workflow publishes to npm automatically (`NPM_TOKEN` secret).

## Editing the family

Edit `src/family.ts`, `pnpm build`, commit `dist/`, bump version, tag. See `README.md`
for the public API (`FAMILY`, `siblings`, `projectFamilyItems`, `label`).
