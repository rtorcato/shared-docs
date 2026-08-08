---
name: shared-docs
description: Use when wiring a docs site's navbar dropdown, footer, copyright line, or "Sibling projects" grid in a project that depends on @rtorcato/shared-docs, or when adding/editing a member of the @rtorcato family. Covers the FAMILY data, the nav/footer builders, the Docusaurus components and their subpath imports, and the two intentional footguns in siblings() and label().
---

# Using @rtorcato/shared-docs

`@rtorcato/shared-docs` is the single source of truth for the `@rtorcato` open-source
family — the list itself, plus framework-neutral nav/footer builders and four
Docusaurus React components. ESM-only, Node ≥22, React 18/19 as a peer dep.

Install: `pnpm add -D @rtorcato/shared-docs`

## Rules

1. **Never hard-code the family list in a consuming site.** Import `FAMILY`,
   `siblings()`, or `projectFamilyItems()` — a site that copies the array drifts the
   moment a package is added here.

2. **Pass the *exact* package name to `siblings()`.** It filters by `===` on `name`
   and returns the **full list unchanged** for a name not in `FAMILY`, so a typo
   makes a site silently render itself in its own sibling grid. Use
   `'@rtorcato/cf-common'`, not `'cf-common'`.

3. **The root export is framework-neutral; the components are Docusaurus-only.**
   `Siblings` and `UseWithAI` import `@docusaurus/Link` and `@theme/CodeBlock`.
   In Fumadocs or any non-Docusaurus site use the data helpers and render your own
   markup. `InstallTabs` and `CommandBlock` are plain React and work anywhere.

4. **Import components from their subpath.** Each ships its own CSS module, imported
   by the component itself — there is no separate stylesheet to pull in.
   ```tsx
   // ✅ do
   import Siblings from '@rtorcato/shared-docs/components/Siblings'
   // ❌ don't — components are not re-exported from the root
   import { Siblings } from '@rtorcato/shared-docs'
   ```

5. **`copyright()` is evaluated at call time**, stamping the current year. Call it in
   the config, don't cache the string across a long-running process.

## API — root export (`@rtorcato/shared-docs`)

| Export | Signature | Use |
|---|---|---|
| `FAMILY` | `FamilyMember[]` | the whole family, including the consuming site's own package |
| `siblings` | `(selfName: string) => FamilyMember[]` | the family minus one package — the landing-page grid |
| `projectFamilyItems` | `() => { label, href }[]` | nav-dropdown / footer link items |
| `label` | `(m: FamilyMember) => string` | short label; strips `@rtorcato/` **and nothing else** — `db-x` renders as-is |
| `copyright` | `(builtWith?: string) => string` | footer line; defaults to `'Docusaurus'`, Fumadocs passes `copyright('Fumadocs')` |
| `GITHUB_PROFILE` | `string` | `https://github.com/rtorcato` |
| `FamilyMember` | `{ name, tagline, href, dest: 'Docs' \| 'GitHub', accent }` | type only |
| `FamilyLink` | `{ label, href }` | type only |

```ts
// docusaurus.config.ts
import { GITHUB_PROFILE, copyright, projectFamilyItems } from '@rtorcato/shared-docs'

const PROJECT_FAMILY = projectFamilyItems()

navbar: { items: [
  { type: 'dropdown', label: 'Projects', items: [
    { label: 'All on GitHub →', href: GITHUB_PROFILE },
    ...PROJECT_FAMILY,
  ] },
] },
footer: { links: [{ title: 'Projects', items: PROJECT_FAMILY }], copyright: copyright() },
```

## Components (Docusaurus)

Each is a **default** export on its own subpath.

| Subpath | Props | Renders |
|---|---|---|
| `/components/Siblings` | `{ self: string }` | the "Sibling projects" card grid, excluding `self` |
| `/components/InstallTabs` | `{ pkg: string }` | npm/pnpm/yarn/bun tabs with a copy button |
| `/components/CommandBlock` | `{ commands: string[] }` | a stack of copyable command rows |
| `/components/UseWithAI` | `{ repo, plugin, name?, rules }` | the "Use with AI" section — Claude Code plugin install + pasteable rules |

```tsx
// src/pages/index.tsx
import InstallTabs from '@rtorcato/shared-docs/components/InstallTabs'
import Siblings from '@rtorcato/shared-docs/components/Siblings'

<InstallTabs pkg="@rtorcato/cf-common" />
<Siblings self="@rtorcato/cf-common" />
```

`InstallTabs` also exports a named `CopyIcon({ done })` — reuse it rather than
adding a second copy icon.

## Editing the family

Edit `src/family.ts` only — it's the one source of truth.

1. Add or change the `FamilyMember` entry. `href` prefers the published docs site,
   falling back to the GitHub repo with `dest: 'GitHub'`. **Verify the `href`
   resolves** — four entries have silently drifted to dead links before.
2. `pnpm build`, then commit `src/` and `dist/` **together**. `dist/` is committed
   on purpose for the remaining git-dep consumers; CI fails if it's stale.
3. Commit as `feat:` or `fix:`. semantic-release derives the version from the
   message, so a `chore:`/`docs:` commit publishes **nothing** and the change never
   reaches any site.

Sites pick it up with `pnpm update @rtorcato/shared-docs`.
