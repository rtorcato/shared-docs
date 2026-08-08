# @rtorcato/shared-docs

Shared data and helpers for the `@rtorcato` docs sites — the framework-neutral
sibling-family list and nav/footer builders, plus Docusaurus components.

The single source of truth for the **sibling-family list** — the cross-links
every `@rtorcato/*` docs site shows in its nav, footer, and landing grid. Edit
the family once here; each site picks it up on its next build.

## Install

```sh
pnpm add -D @rtorcato/shared-docs
```

Published to npm as a normal semver package. There's no install-time build step
(no `allowBuilds` allowlisting needed in consumers). Update with
`pnpm update @rtorcato/shared-docs`.

> **Migrating from the git dependency?** Earlier versions of this README
> recommended `github:rtorcato/shared-docs`, which resolves to whatever is
> currently on `main` — unpinned, and updated with no release step in between.
> Replace it with the npm dep above. `dist/` stays committed until the last
> git-dep consumer has moved across (see #8).

> Maintainers: while `dist/` is still committed, run `pnpm build` and commit it
> whenever you change `src/`. CI fails if the committed copy is stale.

## Usage

**Docusaurus config** (`docusaurus.config.ts`) — nav dropdown + footer:

```ts
import { projectFamilyItems } from '@rtorcato/shared-docs'

const PROJECT_FAMILY = projectFamilyItems() // { label, href }[]

// navbar dropdown:
{ type: 'dropdown', label: 'Projects', items: [{ label: 'All on GitHub →', href: GITHUB_PROFILE }, ...PROJECT_FAMILY] }
// footer column:
{ title: 'Projects', items: PROJECT_FAMILY }
```

**Landing page** (`src/pages/index.tsx`) — "Sibling projects" grid, excluding
your own package:

```tsx
import { siblings, type FamilyMember } from '@rtorcato/shared-docs'

const SIBLINGS = siblings('@rtorcato/cf-common')
```

## API

- `FAMILY: FamilyMember[]` — the full family (all packages, including each site's own).
- `siblings(selfName): FamilyMember[]` — the family minus one package, for a grid.
- `projectFamilyItems(): { label, href }[]` — nav/footer link items for the whole family.
- `label(member): string` — short label (package name without the `@rtorcato/` scope).
- `copyright(builtWith?): string` — footer copyright line, stamped with the current
  year. Defaults to `'Docusaurus'`; a Fumadocs site passes `copyright('Fumadocs')`.
- `GITHUB_PROFILE: string` — the `@rtorcato` GitHub profile URL.
- `FamilyMember` — `{ name, tagline, href, dest, accent }`.

Two behaviours worth knowing, both intentional:

- `siblings()` returns the **full list unchanged** if `selfName` isn't in `FAMILY`,
  so a typo makes a site render itself in its own grid. Pass the exact package name.
- `label()` only strips `@rtorcato/`. A member outside that scope renders as-is.

## Use with AI

This repo ships a self-contained agent skill so coding agents wire the nav, footer,
and sibling grid correctly — including the two footguns above.

**Any agent with the [`skills`](https://www.npmjs.com/package/skills) CLI** — one
command, straight from GitHub (no clone, no package install):

```sh
npx skills add https://github.com/rtorcato/shared-docs --skill shared-docs
```

Source: [`skills/shared-docs/SKILL.md`](./skills/shared-docs/SKILL.md).

## Adding / editing a sibling

Edit `src/family.ts`, run `pnpm build`, and commit `src/` and `dist/` together.

Don't bump `version` or tag by hand — semantic-release does that from the commit
message on push to `main`. Use `feat:` or `fix:`; a `chore:` or `docs:` commit
publishes nothing, so the change never reaches consumers. Sites then pick it up via
`pnpm update @rtorcato/shared-docs`.

## Colour and theming

This repo's components consume `--ifm-*`/`--jt-*` colour tokens; `repo-tooling`'s
`tooling/docusaurus/` owns the theme that defines them. See "Boundary with
repo-tooling" in `CLAUDE.md` before adding CSS.
