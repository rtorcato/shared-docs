# CLAUDE.md

`@rtorcato/shared-docs` — the framework-neutral sibling-family list plus nav/footer
builders and Docusaurus components, for the `@rtorcato/*` docs sites. `src/family.ts`
is the single source of truth for the family every sibling site renders in its nav,
footer, and landing grid.

## Golden rule

`dist/` is **committed on purpose** (see `.gitignore`) so the remaining git-dep
consumers install prebuilt output with no build step. **After any change to `src/`,
run `pnpm build` and commit the updated `dist/`.** CI fails if `dist/` drifts.

This is temporary: the package is npm-first now, and `dist/` comes out of git once
the last git-dep consumer has migrated (#8).

## Commands

- `pnpm build` — `tsc` + copy CSS to `dist/` (run before every commit that touches `src/`)
- `pnpm typecheck` — `tsc --noEmit`

## Stack

ESM-only TypeScript library, pnpm, Node ≥22. Install with
`pnpm add -D @rtorcato/shared-docs`.

## Release

**Automatic — do not tag or bump `version` by hand.** semantic-release runs on every
push to `main` and derives the version from the commit messages, so the type prefix
is what decides whether consumers get the change:

- `feat:` → minor, `fix:` → patch, `chore:`/`docs:`/`ci:` → **no release at all**

A change that consumers need to install must therefore land as `feat:` or `fix:`.

## Editing the family

Edit `src/family.ts`, `pnpm build`, commit both `src/` and `dist/`, and use a `feat:`
commit so a release actually goes out. Verify new `href`s resolve — #7 exists because
four entries drifted to dead links and nothing noticed.

Two traps in the API, both intentional:

- `siblings(selfName)` returns the **full list unchanged** for a name not in `FAMILY`,
  so a typo makes a site render itself in its own sibling grid.
- `label()` only strips `@rtorcato/`, so a non-scoped member (`db-x`) renders as-is.

See `README.md` for the public API.
