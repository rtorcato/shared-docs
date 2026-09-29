import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { DOCS_ASSETS } from './brand.js'
import { ASSETS, DOCS_APP, SCAFFOLD_FILES, shippedFiles } from './docs-site.js'
import { exists, read } from './fs.js'

export interface Check {
	check: string
	status: 'ok' | 'warn' | 'fail'
	detail?: string
}

const BRAND_FILES = [
	'favicon.svg',
	'banner.svg',
	'banner-mobile.svg',
	'social-card.svg',
	'render.sh',
]

/** Report drift from what `init` and `brand` scaffold. Read-only. */
export async function doctor(dir: string): Promise<Check[]> {
	const out: Check[] = []
	const at = (rel: string) => path.join(dir, rel)

	for (const rel of SCAFFOLD_FILES) {
		out.push(
			(await exists(at(rel)))
				? { check: rel, status: 'ok' }
				: { check: rel, status: 'fail', detail: 'missing — run `shared-docs init`' }
		)
	}

	// The shipped theme files are meant to be identical everywhere; a hand edit is drift, not an error.
	for (const [asset, target] of shippedFiles({})) {
		if (!(await exists(at(target)))) continue
		const same =
			(await readFile(at(target), 'utf8')) === (await readFile(new URL(asset, ASSETS), 'utf8'))
		if (!same)
			out.push({
				check: `${target} matches shipped`,
				status: 'warn',
				detail: 'differs from this version of shared-docs — `shared-docs init --update` replaces it',
			})
	}

	const contains = async (rel: string, needle: string | RegExp, check: string, detail: string) => {
		if (!(await exists(at(rel)))) return
		const text = await read(at(rel))
		const has = typeof needle === 'string' ? text.includes(needle) : needle.test(text)
		out.push(has ? { check, status: 'ok' } : { check, status: 'fail', detail })
	}
	const cfg = `${DOCS_APP}/docusaurus.config.ts`
	await contains(
		cfg,
		"'@rtorcato/shared-docs'",
		'config imports shared-docs',
		`${cfg} does not import @rtorcato/shared-docs`
	)
	await contains(
		cfg,
		'projectFamilyItems',
		'config renders the Projects dropdown/footer',
		`${cfg} never calls projectFamilyItems()`
	)
	await contains(
		cfg,
		'copyright(',
		'config uses copyright()',
		`${cfg} hardcodes its copyright line`
	)
	await contains(
		`${DOCS_APP}/src/css/custom.css`,
		/@import\s+["']\.\/_jt-tokens\.css["'][\s\S]*@import\s+["']\.\/theme\.css["']/,
		'custom.css imports tokens then theme',
		'custom.css must @import _jt-tokens.css then theme.css'
	)
	await contains(
		`${DOCS_APP}/src/pages/index.tsx`,
		'Siblings',
		'landing page renders Siblings',
		'landing page does not render <Siblings>'
	)
	await contains(
		`${DOCS_APP}/package.json`,
		'"@rtorcato/shared-docs"',
		'docs app depends on shared-docs',
		'add @rtorcato/shared-docs to apps/docs dependencies'
	)

	const tsconfig = at(`${DOCS_APP}/tsconfig.json`)
	if (await exists(tsconfig)) {
		const legacy = /"baseUrl"\s*:|"moduleResolution"\s*:\s*"node(10)?"/i.test(
			(await read(tsconfig)).replace(/^\s*\/\/.*$/gm, '')
		)
		out.push(
			legacy
				? {
						check: 'tsconfig is TS 7-ready',
						status: 'fail',
						detail: 'baseUrl / moduleResolution: node were removed in TypeScript 7',
					}
				: { check: 'tsconfig is TS 7-ready', status: 'ok' }
		)
	}

	for (const f of BRAND_FILES) {
		out.push(
			(await exists(at(`brand/${f}`)))
				? { check: `brand/${f}`, status: 'ok' }
				: { check: `brand/${f}`, status: 'warn', detail: 'missing — run `shared-docs brand`' }
		)
	}

	// The config points at these; brand/ existing means they should have been synced in.
	if ((await exists(at('brand'))) && (await exists(at(DOCS_APP)))) {
		for (const f of DOCS_ASSETS) {
			const rel = `${DOCS_APP}/static/img/${f}`
			out.push(
				(await exists(at(rel)))
					? { check: rel, status: 'ok' }
					: {
							check: rel,
							status: 'warn',
							detail: 'missing — run `shared-docs brand` (PNG/ICO need rsvg-convert)',
						}
			)
		}
	}
	return out
}
