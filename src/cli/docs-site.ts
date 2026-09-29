import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { familyEntry, syncBrandToDocs } from './brand.js'
import { exists, read, writeIfMissing } from './fs.js'

type Pkg = Record<string, unknown> | null

/** Shipped files (theme, tokens, scripts), resolved from dist/cli/ to the package's assets/. */
export const ASSETS = new URL('../../assets/', import.meta.url)

export const DOCS_APP = 'apps/docs'
const DOCUSAURUS_RANGE = '^3.10.2'
const TYPESCRIPT_RANGE = '~7.0.2'
// ponytail: literal on purpose — package.json's `version` is stale by design (semantic-release sets it at publish).
const SHARED_DOCS_RANGE = '^1.2.0'
/** Docusaurus's neutral green — the default accent, meant to be branded over. */
const DEFAULT_ACCENT = { light: '#2e8555', dark: '#25c2a0' }

export interface DocsSiteOptions {
	/** Accent override; else the family entry's accent, else Docusaurus green. */
	accent?: { light: string; dark: string }
	tagline?: string
	/** Wire one `docusaurus-plugin-typedoc` instance per single-segment subpath export. */
	typedoc?: boolean
	/** Also write scripts/docs-helpers.mjs (markdown-table escaping, export parser). */
	helpers?: boolean
}

interface SiteMeta {
	pkgName: string
	docsPkgName: string
	title: string
	tagline: string
	owner: string
	repo: string
}

function inferSiteMeta(pkg: Pkg, dir: string, tagline?: string): SiteMeta {
	const pkgName = typeof pkg?.name === 'string' ? pkg.name : `@rtorcato/${path.basename(dir)}`
	const repoUrl =
		typeof pkg?.repository === 'string'
			? pkg.repository
			: (pkg?.repository as { url?: string } | undefined)?.url
	const m = repoUrl?.match(/github\.com[/:]([^/]+)\/([^/.]+)/)
	const base = pkgName.split('/').pop() ?? pkgName
	const description = typeof pkg?.description === 'string' ? pkg.description : undefined
	return {
		pkgName,
		docsPkgName: `${pkgName}-docs`,
		title: m?.[2] ?? base,
		tagline: tagline ?? familyEntry(pkgName)?.tagline ?? description ?? 'Documentation',
		owner: m?.[1] ?? 'rtorcato',
		repo: m?.[2] ?? base,
	}
}

/** Single-segment subpath exports (`./errors`) map to `src/<id>/index.ts` — the TypeDoc modules. */
function typedocModules(pkg: Pkg): string[] {
	const exp = pkg?.exports
	if (!exp || typeof exp !== 'object') return []
	return Object.keys(exp)
		.filter((k) => /^\.\/[^/]+$/.test(k) && k !== './package.json')
		.map((k) => k.slice(2))
}

/** A JS string literal in the Biome preset's quote style (single quotes unless that means more escaping). */
function jsString(value: string): string {
	const singles = value.split("'").length - 1
	const doubles = value.split('"').length - 1
	if (singles > doubles) return JSON.stringify(value)
	return `'${JSON.stringify(value).slice(1, -1).replaceAll('\\"', '"').replaceAll("'", "\\'")}'`
}

function docusaurusConfig(meta: SiteMeta, modules: string[], hasLogo: boolean): string {
	const ghUrl = `https://github.com/${meta.owner}/${meta.repo}`
	const typedocImport = modules.length
		? "// @ts-expect-error -- plain .mjs helper written by `shared-docs init --typedoc`\nimport { getTypedocPlugins } from '../../scripts/typedoc.mjs'\n"
		: ''
	const typedocPlugins = modules.length
		? `\t\t...getTypedocPlugins([${modules.map(jsString).join(', ')}]),\n`
		: ''
	return `import type * as Preset from '@docusaurus/preset-classic'
import type { Config } from '@docusaurus/types'
import { GITHUB_PROFILE, copyright, projectFamilyItems } from '@rtorcato/shared-docs'
import { themes as prismThemes } from 'prism-react-renderer'
${typedocImport}
const config: Config = {
\ttitle: ${jsString(meta.title)},
\ttagline: ${jsString(meta.tagline)},
\tfavicon: 'img/favicon.ico',

\turl: 'https://${meta.owner}.github.io',
\tbaseUrl: '/${meta.repo}/',

\torganizationName: '${meta.owner}',
\tprojectName: '${meta.repo}',

\tonBrokenLinks: 'warn',

\tmarkdown: {
\t\tformat: 'detect',
\t\thooks: {
\t\t\tonBrokenMarkdownLinks: 'warn',
\t\t},
\t},

\ti18n: {
\t\tdefaultLocale: 'en',
\t\tlocales: ['en'],
\t},

\tpresets: [
\t\t[
\t\t\t'classic',
\t\t\t{
\t\t\t\tdocs: {
\t\t\t\t\tsidebarPath: './sidebars.ts',
\t\t\t\t\trouteBasePath: '/docs',
\t\t\t\t\teditUrl: '${ghUrl}/edit/main/apps/docs/',
\t\t\t\t},
\t\t\t\tblog: false,
\t\t\t\ttheme: {
\t\t\t\t\tcustomCss: './src/css/custom.css',
\t\t\t\t},
\t\t\t} satisfies Preset.Options,
\t\t],
\t],

\tplugins: [
${typedocPlugins}\t\t[
\t\t\t'@easyops-cn/docusaurus-search-local',
\t\t\t{
\t\t\t\thashed: true,
\t\t\t\tindexDocs: true,
\t\t\t\tindexBlog: false,
\t\t\t\tdocsRouteBasePath: '/docs',
\t\t\t\thighlightSearchTermsOnTargetPage: true,
\t\t\t\tsearchBarShortcutHint: false,
\t\t\t},
\t\t],
\t],

\tthemeConfig: {
\t\timage: 'img/social-card.png',
\t\tcolorMode: {
\t\t\tdefaultMode: 'dark',
\t\t\trespectPrefersColorScheme: true,
\t\t},
\t\tnavbar: {
\t\t\ttitle: ${jsString(meta.title)},
${hasLogo ? `\t\t\tlogo: { alt: ${jsString(meta.title)}, src: 'img/favicon.svg' },\n` : ''}
\t\t\titems: [
\t\t\t\t{ to: '/docs', position: 'left', label: 'Docs' },
\t\t\t\t{
\t\t\t\t\ttype: 'dropdown',
\t\t\t\t\tlabel: 'Projects',
\t\t\t\t\tposition: 'left',
\t\t\t\t\titems: [...projectFamilyItems(), { label: 'All on GitHub →', href: GITHUB_PROFILE }],
\t\t\t\t},
\t\t\t\t{ href: '${ghUrl}', label: 'GitHub', position: 'right' },
\t\t\t],
\t\t},
\t\tfooter: {
\t\t\tstyle: 'dark',
\t\t\tlinks: [
\t\t\t\t{ title: 'Docs', items: [{ label: 'Getting Started', to: '/docs' }] },
\t\t\t\t{
\t\t\t\t\ttitle: 'More',
\t\t\t\t\titems: [
\t\t\t\t\t\t{ label: 'GitHub', href: '${ghUrl}' },
\t\t\t\t\t\t{ label: 'Issues', href: '${ghUrl}/issues' },
\t\t\t\t\t],
\t\t\t\t},
\t\t\t\t{ title: 'Projects', items: projectFamilyItems() },
\t\t\t],
\t\t\tcopyright: copyright(),
\t\t},
\t\t// \`theme\` is the LIGHT-mode Prism theme and \`darkTheme\` the dark one; the
\t\t// shared stylesheet assumes this pairing.
\t\tprism: {
\t\t\ttheme: prismThemes.vsLight,
\t\t\tdarkTheme: prismThemes.vsDark,
\t\t\tadditionalLanguages: ['bash', 'json', 'typescript'],
\t\t},
\t} satisfies Preset.ThemeConfig,
}

export default config
`
}

const SIDEBARS = `import type { SidebarsConfig } from '@docusaurus/plugin-content-docs'

// Autogenerated from the docs/ folder structure — add markdown files and they
// appear here. Swap for an explicit list when you want to control ordering.
const sidebars: SidebarsConfig = {
\tdocs: [{ type: 'autogenerated', dirName: '.' }],
}

export default sidebars
`

const TSCONFIG = `// Improves IDE type-checking; not used by \`docusaurus start/build\`.
{
  "compilerOptions": {
    // TypeScript 7 removed \`baseUrl\` and \`moduleResolution: node\`.
    "paths": { "@site/*": ["./*"] },
    "strict": true,
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowJs": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/", "docusaurus.config.ts", "sidebars.ts"],
  "exclude": [".docusaurus", "build", "node_modules"]
}
`

const MOBILE_MENU_CSS = `/* Mobile drawer: one flat menu (see src/theme/Navbar/MobileSidebar). */
.navbar-sidebar__items,
.navbar-sidebar__items.navbar-sidebar__items--show-secondary {
\ttransform: translate3d(0, 0, 0) !important;
}
.navbar-sidebar__items > .navbar-sidebar__item:nth-child(2),
.navbar-sidebar__back {
\tdisplay: none !important;
}
.jt-mobile-menu {
\tdisplay: flex;
\tflex-direction: column;
\tgap: 4px;
\tpadding: 4px 0;
\tmargin: 0;
\tlist-style: none;
}
.jt-mobile-menu__link {
\tdisplay: block;
\tpadding: 12px 14px;
\tborder-radius: 8px;
\tcolor: var(--jt-heading);
\tfont-weight: 600;
\tfont-size: 15px;
\ttext-decoration: none;
}
.jt-mobile-menu__link:hover,
.jt-mobile-menu__link:focus-visible {
\tbackground: var(--jt-surface2);
\tcolor: var(--jt-heading);
\ttext-decoration: none;
}
.jt-mobile-menu__link--active {
\tbackground: var(--jt-accent-soft);
\tcolor: var(--jt-accent);
}
.jt-mobile-menu__external::after {
\tcontent: " ↗";
\tcolor: var(--jt-faint);
\tfont-weight: 400;
}
`

function customCss(accent: { light: string; dark: string }): string {
	return `/* biome-ignore-all lint/complexity/noImportantStyles: the mobile drawer must beat Infima's transform */
/* Site theme: the shared design tokens + this project's accent. */
@import "./_jt-tokens.css";
@import "./theme.css";

:root {
\t--ifm-color-primary: ${accent.light};
\t--jt-accent: ${accent.light};
}

[data-theme="dark"] {
\t--ifm-color-primary: ${accent.dark};
\t--jt-accent: ${accent.dark};
}

${MOBILE_MENU_CSS}`
}

function docsPackageJson(meta: SiteMeta, typedoc: boolean): string {
	const pkg = {
		name: meta.docsPkgName,
		version: '0.0.1',
		private: true,
		scripts: {
			docusaurus: 'docusaurus',
			'sync-changelog': 'node ../../scripts/sync-changelog.mjs',
			// pnpm 8 doesn't run pre* hooks reliably — chain sync-changelog explicitly.
			start: 'pnpm run sync-changelog && docusaurus start',
			dev: 'pnpm run sync-changelog && docusaurus start',
			build: 'pnpm run sync-changelog && docusaurus build',
			serve: 'docusaurus serve',
			clear: 'docusaurus clear',
			typecheck: 'tsc --noEmit',
		},
		dependencies: {
			'@docusaurus/core': DOCUSAURUS_RANGE,
			'@docusaurus/preset-classic': DOCUSAURUS_RANGE,
			'@easyops-cn/docusaurus-search-local': '^0.55.2',
			'@mdx-js/react': '^3.1.0',
			'@rtorcato/shared-docs': SHARED_DOCS_RANGE,
			clsx: '^2.1.1',
			'prism-react-renderer': '^2.4.1',
			react: '^19.0.0',
			'react-dom': '^19.0.0',
		},
		devDependencies: {
			'@docusaurus/module-type-aliases': DOCUSAURUS_RANGE,
			'@docusaurus/tsconfig': DOCUSAURUS_RANGE,
			'@docusaurus/types': DOCUSAURUS_RANGE,
			'@types/react': '^19.0.0',
			typescript: TYPESCRIPT_RANGE,
			...(typedoc
				? {
						'docusaurus-plugin-typedoc': '^1.4.0',
						typedoc: '^0.28.0',
						'typedoc-plugin-markdown': '^4.9.0',
					}
				: {}),
		},
		browserslist: {
			production: ['>0.5%', 'not dead', 'not op_mini all'],
			development: ['last 3 chrome version', 'last 3 firefox version', 'last 5 safari version'],
		},
		engines: { node: '>=22.0' },
	}
	return `${JSON.stringify(pkg, null, 2)}\n`
}

const introDoc = (meta: SiteMeta): string => `---
title: ${meta.title}
slug: /
sidebar_position: 0
---

# ${meta.title}

${meta.tagline}

Welcome to the docs. Edit \`apps/docs/docs/intro.md\` to get started, and add
more markdown files under \`apps/docs/docs/\` — they appear in the sidebar
automatically.
`

/** Drives the shared reusable deploy on push to main. */
const docsWorkflow = (meta: SiteMeta): string => `name: 📚 Docs
on:
  push:
    branches: [main]
    paths:
      - 'apps/docs/**'
      - '.github/workflows/docs.yml'
  # The changelog page is built from GitHub Releases. A release created with
  # GITHUB_TOKEN never fires \`release: published\`, so rebuild once CI (which
  # runs semantic-release) succeeds on main instead — no PAT needed.
  workflow_run:
    workflows: ['🚀 CI/CD Pipeline']
    types: [completed]
    branches: [main]
  workflow_dispatch:

jobs:
  docs:
    if: github.event_name != 'workflow_run' || github.event.workflow_run.conclusion == 'success'
    permissions:
      contents: read
      pages: write
      id-token: write
    uses: rtorcato/repo-tooling/.github/workflows/docs-deploy.yml@main
    with:
      build-filter: '${meta.docsPkgName}'
`

// routeBasePath is '/docs', so without a page of its own the site root — and the
// navbar logo — would 404. Tabs/no semicolons to match the Biome preset.
function homePage(meta: SiteMeta, install: string | null): string {
	const installBlock = install
		? `\t\t\t\t<pre className={styles.install}>
\t\t\t\t\t<code>{${jsString(install)}}</code>
\t\t\t\t</pre>
`
		: ''
	return `import Link from '@docusaurus/Link'
import Siblings from '@rtorcato/shared-docs/components/Siblings'
import Layout from '@theme/Layout'
import styles from './index.module.css'

// Placeholder pillars — replace with what the project is actually about.
const PILLARS = [
\t{ title: 'Pillar one', body: 'One sentence on the first thing that sets this project apart.' },
\t{ title: 'Pillar two', body: 'One sentence on the second thing.' },
\t{ title: 'Pillar three', body: 'One sentence on the third thing.' },
]

export default function Home() {
\treturn (
\t\t<Layout title={${jsString(meta.title)}} description={${jsString(meta.tagline)}}>
\t\t\t<header className={styles.hero}>
\t\t\t\t<h1 className={styles.title}>{${jsString(meta.title)}}</h1>
\t\t\t\t<p className={styles.tagline}>{${jsString(meta.tagline)}}</p>
${installBlock}\t\t\t\t<Link className="button button--primary button--lg" to="/docs">
\t\t\t\t\tGet started
\t\t\t\t</Link>
\t\t\t</header>
\t\t\t<main className={styles.pillars}>
\t\t\t\t{PILLARS.map((p) => (
\t\t\t\t\t<section key={p.title} className={styles.pillar}>
\t\t\t\t\t\t<h2>{p.title}</h2>
\t\t\t\t\t\t<p>{p.body}</p>
\t\t\t\t\t</section>
\t\t\t\t))}
\t\t\t</main>
\t\t\t<Siblings self=${JSON.stringify(meta.pkgName)} />
\t\t</Layout>
\t)
}
`
}

const HOME_CSS = `.hero {
\tpadding: 5rem 1rem 3rem;
\ttext-align: center;
}

.title {
\tfont-size: clamp(2.5rem, 6vw, 4rem);
\tmargin-bottom: 0.5rem;
}

.tagline {
\tfont-size: 1.25rem;
\tcolor: var(--jt-muted);
\tmax-width: 40rem;
\tmargin: 0 auto 1.5rem;
}

.install {
\tdisplay: inline-block;
\tpadding: 0.75rem 1.25rem;
\tmargin-bottom: 1.5rem;
\tbackground: var(--jt-code-bg);
\tborder: 1px solid var(--jt-border);
\tborder-radius: 12px;
}

.pillars {
\tdisplay: grid;
\tgap: 1rem;
\tgrid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
\tmax-width: 64rem;
\tmargin: 0 auto;
\tpadding: 1rem 1rem 4rem;
}

.pillar {
\tpadding: 1.25rem;
\tbackground: var(--jt-surface);
\tborder: 1px solid var(--jt-border);
\tborder-radius: 14px;
}

.pillar:hover {
\tborder-color: var(--jt-accent-border);
}
`

/** Mobile drawer swizzle: one flat menu mirroring the navbar (docs, projects, GitHub). */
function mobilePrimaryMenu(ghUrl: string): string {
	return `import Link from '@docusaurus/Link'
import { useLocation } from '@docusaurus/router'
import useBaseUrl from '@docusaurus/useBaseUrl'
import { projectFamilyItems } from '@rtorcato/shared-docs'
import { type ReactElement, useEffect, useRef } from 'react'

/**
 * Swizzled (replace) theme/Navbar/MobileSidebar/PrimaryMenu: a single flat
 * list instead of the primary→secondary drawer flow. Keep ITEMS in step with the
 * navbar in docusaurus.config.ts by hand.
 *
 * On doc pages the doc plugin's mobile-sidebar filler makes Layout set \`inert\`
 * on the primary panel, which leaves these links unclickable — a
 * MutationObserver strips it. The drawer also stops auto-closing after the
 * swizzle, so each link tap clicks \`.navbar-sidebar__close\` on the next tick.
 */
const ITEMS: Array<{ label: string; to?: string; href?: string }> = [
\t{ label: 'Docs', to: '/docs' },
\t...projectFamilyItems(),
\t{ label: 'GitHub', href: ${jsString(ghUrl)} },
]

function closeDrawer(): void {
\tsetTimeout(() => document.querySelector<HTMLButtonElement>('.navbar-sidebar__close')?.click(), 0)
}

function MenuLink({ item }: { item: (typeof ITEMS)[number] }): ReactElement {
\tconst { pathname } = useLocation()
\tconst resolved = useBaseUrl(item.to ?? '/')
\tconst isActive = item.to !== undefined && pathname === resolved
\tconst className = [
\t\t'jt-mobile-menu__link',
\t\tisActive && 'jt-mobile-menu__link--active',
\t\titem.href && 'jt-mobile-menu__external',
\t]
\t\t.filter(Boolean)
\t\t.join(' ')
\tconst linkProps = item.href ? { href: item.href } : { to: item.to ?? '/' }
\treturn (
\t\t<li>
\t\t\t<Link
\t\t\t\tclassName={className}
\t\t\t\t{...linkProps}
\t\t\t\tonClick={closeDrawer}
\t\t\t\taria-current={isActive ? 'page' : undefined}
\t\t\t>
\t\t\t\t{item.label}
\t\t\t</Link>
\t\t</li>
\t)
}

export default function NavbarMobilePrimaryMenu(): ReactElement {
\tconst ref = useRef<HTMLUListElement>(null)

\tuseEffect(() => {
\t\tconst panel = ref.current?.closest<HTMLElement>('.navbar-sidebar__item')
\t\tif (!panel) return
\t\tconst strip = () => panel.removeAttribute('inert')
\t\tstrip()
\t\tconst observer = new MutationObserver(strip)
\t\tobserver.observe(panel, { attributes: true, attributeFilter: ['inert'] })
\t\treturn () => observer.disconnect()
\t}, [])

\treturn (
\t\t<ul ref={ref} className="jt-mobile-menu">
\t\t\t{ITEMS.map((item) => (
\t\t\t\t<MenuLink key={item.label} item={item} />
\t\t\t))}
\t\t</ul>
\t)
}
`
}

const MOBILE_SECONDARY_MENU = `/**
 * Swizzled (replace) theme/Navbar/MobileSidebar/SecondaryMenu — disabled, so the
 * drawer stays on the flat PrimaryMenu. The CSS in custom.css locks the items
 * container so the primary panel never slides away.
 */
export default function NavbarMobileSidebarSecondaryMenu(): null {
\treturn null
}
`

/** Ensure `pnpm-workspace.yaml` lists `apps/*` and approves the site's build scripts. */
async function ensureWorkspace(dir: string): Promise<string | null> {
	const rel = 'pnpm-workspace.yaml'
	const file = path.join(dir, rel)
	const body = (await exists(file)) ? await read(file) : ''
	let next = body
	if (!/^\s*-\s*['"]?apps\/\*/m.test(body)) {
		next = /^packages:/m.test(body)
			? body.replace(/^packages:\n/m, "packages:\n  - 'apps/*'\n")
			: `packages:\n  - 'apps/*'\n${body ? `\n${body}` : ''}`
	}
	// ponytail: only adds the block when absent; merging into an existing allowBuilds is left to the user.
	if (!/^allowBuilds:/m.test(next)) {
		next = `${next.replace(/\n*$/, '\n')}\nallowBuilds:\n  core-js: false\n  core-js-pure: false\n  esbuild: true\n  sharp: true\n`
	}
	if (next === body) return null
	await writeFile(file, next)
	return rel
}

/** Shipped asset -> target under the repo root. The theme trio is always written; the scripts are opt-in. */
export const shippedFiles = (o: DocsSiteOptions): Array<[asset: string, target: string]> => {
	const files: Array<[string, string]> = [
		['sync-changelog.mjs', 'scripts/sync-changelog.mjs'],
		['theme-tokens.css', `${DOCS_APP}/src/css/_jt-tokens.css`],
		['theme.css', `${DOCS_APP}/src/css/theme.css`],
	]
	if (o.typedoc) files.push(['typedoc.mjs', 'scripts/typedoc.mjs'])
	if (o.helpers) files.push(['docs-helpers.mjs', 'scripts/docs-helpers.mjs'])
	return files
}

/**
 * Scaffold the Docusaurus docs site wired to this package. Writes each file only
 * when missing and returns the paths actually written, so it is safe to re-run.
 */
export async function generateDocsSite(
	pkg: Pkg,
	dir: string,
	options: DocsSiteOptions = {}
): Promise<string[]> {
	const meta = inferSiteMeta(pkg, dir, options.tagline)
	const member = familyEntry(meta.pkgName)
	const accent =
		options.accent ?? (member ? { light: member.accent, dark: member.accent } : DEFAULT_ACCENT)
	const modules = options.typedoc ? typedocModules(pkg) : []
	const written: string[] = []

	for (const [asset, target] of shippedFiles({ ...options, typedoc: modules.length > 0 })) {
		const w = await writeIfMissing(dir, target, await readFile(new URL(asset, ASSETS)))
		if (w) written.push(w)
	}

	const ghUrl = `https://github.com/${meta.owner}/${meta.repo}`
	const install = typeof pkg?.name === 'string' && pkg.private !== true ? `npm i ${pkg.name}` : null
	const files: Array<[string, string]> = [
		[`${DOCS_APP}/package.json`, docsPackageJson(meta, modules.length > 0)],
		[
			`${DOCS_APP}/docusaurus.config.ts`,
			docusaurusConfig(meta, modules, await exists(path.join(dir, 'brand', 'favicon.svg'))),
		],
		[`${DOCS_APP}/sidebars.ts`, SIDEBARS],
		[`${DOCS_APP}/tsconfig.json`, TSCONFIG],
		[`${DOCS_APP}/src/css/custom.css`, customCss(accent)],
		[`${DOCS_APP}/src/pages/index.tsx`, homePage(meta, install)],
		[`${DOCS_APP}/src/pages/index.module.css`, HOME_CSS],
		[`${DOCS_APP}/src/theme/Navbar/MobileSidebar/PrimaryMenu/index.tsx`, mobilePrimaryMenu(ghUrl)],
		[`${DOCS_APP}/src/theme/Navbar/MobileSidebar/SecondaryMenu/index.tsx`, MOBILE_SECONDARY_MENU],
		[`${DOCS_APP}/docs/intro.md`, introDoc(meta)],
		['.github/workflows/docs.yml', docsWorkflow(meta)],
	]
	if (modules.length) {
		files.push([
			`${DOCS_APP}/.gitignore`,
			'# Generated by TypeDoc on build\ndocs/api/\n\n# Docusaurus build artifacts\nbuild/\n.docusaurus/\n',
		])
	}
	for (const [rel, contents] of files) {
		const w = await writeIfMissing(dir, rel, contents)
		if (w) written.push(w)
	}

	// static/img always exists (the config points at img/favicon.ico); brand assets go in when present.
	await mkdir(path.join(dir, DOCS_APP, 'static', 'img'), { recursive: true })
	written.push(...(await syncBrandToDocs(dir)))

	const ws = await ensureWorkspace(dir)
	if (ws) written.push(ws)
	return written
}

/** Every file `init` owns — what `doctor` checks for. */
export const SCAFFOLD_FILES = [
	`${DOCS_APP}/package.json`,
	`${DOCS_APP}/docusaurus.config.ts`,
	`${DOCS_APP}/sidebars.ts`,
	`${DOCS_APP}/tsconfig.json`,
	`${DOCS_APP}/src/css/custom.css`,
	`${DOCS_APP}/src/css/_jt-tokens.css`,
	`${DOCS_APP}/src/css/theme.css`,
	`${DOCS_APP}/src/pages/index.tsx`,
	`${DOCS_APP}/src/theme/Navbar/MobileSidebar/PrimaryMenu/index.tsx`,
	`${DOCS_APP}/src/theme/Navbar/MobileSidebar/SecondaryMenu/index.tsx`,
	'scripts/sync-changelog.mjs',
]
