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

**`version` in `package.json` is stale on purpose and always will be.** #24 dropped
`@semantic-release/git`, so nothing commits the bump back to `main` — semantic-release
sets the version in the published tarball at publish time. The git tag and the npm
registry are the record; `package.json` on `main` is not. Don't "fix" it.

```sh
npm view @rtorcato/shared-docs version   # the real answer
git tag --sort=-v:refname | head -1      # should agree
```

If those two ever disagree, a release failed silently — that has happened before.

## Editing the family

Edit `src/family.ts`, `pnpm build`, commit both `src/` and `dist/`, and use a `feat:`
commit so a release actually goes out. Verify new `href`s resolve — #7 exists because
four entries drifted to dead links and nothing noticed.

Two traps in the API, both intentional:

- `siblings(selfName)` returns the **full list unchanged** for a name not in `FAMILY`,
  so a typo makes a site render itself in its own sibling grid.
- `label()` only strips `@rtorcato/`, so a non-scoped member (`db-x`) renders as-is.

See `README.md` for the public API.

## Boundary with repo-tooling (#10)

- **This repo** — family data, nav/footer builders, React components + their CSS modules.
- **`repo-tooling`'s `tooling/docusaurus/`** — the Docusaurus preset, `theme.css`,
  and `theme-tokens.css` (the `--ifm-*`/`--jt-*` colour tokens).

Colour is owned by the theme, not by this repo. New CSS here consumes a themed
variable, with a literal only as a fallback for a site that hasn't imported the
theme tokens — e.g. `CommandBlock.module.css` and `InstallTabs.module.css` do
`background: var(--ifm-pre-background, #0c111b)`. Never introduce a colour
literal that duplicates a value the theme already defines.

Why: `#0c111b` was hardcoded three times — repo-tooling's `theme.css`, every
site's `docusaurus.config.ts`, and these components — and drifted, which is
what caused the light-mode code-block bug (#6). Fixed here in #17.
