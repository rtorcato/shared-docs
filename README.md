# @rtorcato/shared-docs

Shared data and Docusaurus helpers for the `@rtorcato` docs sites.

The single source of truth for the **sibling-family list** — the cross-links
every `@rtorcato/*` docs site shows in its nav, footer, and landing grid. Edit
the family once here; each site picks it up on its next build.

## Install

```sh
pnpm add -D @rtorcato/shared-docs
```

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
- `FamilyMember` — `{ name, tagline, href, dest, accent }`.

## Adding / editing a sibling

Edit `src/family.ts`, bump the version, publish. Consuming sites update via
`pnpm update @rtorcato/shared-docs` on their next build.
