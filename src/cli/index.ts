#!/usr/bin/env node
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { parseArgs } from 'node:util'
import { doctor } from './doctor.js'
import { generateDocsSite } from './docs-site.js'
import { exists } from './fs.js'

const HELP = `shared-docs — scaffold the @rtorcato family docs site

Usage: shared-docs <command> [options]

Commands:
  init     Scaffold apps/docs (theme, Projects dropdown, family footer, landing page, mobile drawer)
  brand    Deprecated — brand assets moved to \`npx @rtorcato/brand-kit\`
  doctor   Report drift from the scaffold (exit 1 on failures)

Options:
  --dir <path>          Target repo (default: cwd)
  --tagline <text>      Site tagline (default: family entry, else package.json description)
  --accent <hex>        Accent colour, light mode (default: family entry, else Docusaurus green)
  --accent-dark <hex>   Accent colour, dark mode (default: --accent)
  --typedoc             init: wire TypeDoc API pages for single-segment subpath exports
  --helpers             init: also write scripts/docs-helpers.mjs
  --update              init: replace drifted shipped assets (theme, tokens, scripts); never config or pages
  --json                Machine-readable output on stdout
  --yes, -y             Accepted for parity with repo-tooling; the CLI never prompts
  -h, --help
`

const HEX = /^#[0-9a-fA-F]{6}$/

async function main(): Promise<number> {
	const { values, positionals } = parseArgs({
		allowPositionals: true,
		options: {
			dir: { type: 'string' },
			tagline: { type: 'string' },
			accent: { type: 'string' },
			'accent-dark': { type: 'string' },
			typedoc: { type: 'boolean' },
			helpers: { type: 'boolean' },
			update: { type: 'boolean' },
			json: { type: 'boolean' },
			yes: { type: 'boolean', short: 'y' },
			help: { type: 'boolean', short: 'h' },
		},
	})
	const [command] = positionals
	if (values.help || !command) {
		console.log(HELP)
		return values.help ? 0 : 1
	}
	const fail = (message: string): number => {
		if (values.json) console.log(JSON.stringify({ command, ok: false, error: message }))
		else console.error(`error: ${message}`)
		return 1
	}
	for (const flag of ['accent', 'accent-dark'] as const) {
		const v = values[flag]
		if (v && !HEX.test(v)) return fail(`--${flag} must be a #rrggbb hex colour`)
	}

	const dir = path.resolve(values.dir ?? '.')
	const pkgFile = path.join(dir, 'package.json')
	const pkg = (await exists(pkgFile))
		? (JSON.parse(await readFile(pkgFile, 'utf8')) as Record<string, unknown>)
		: null
	const report = (data: Record<string, unknown>, text: string): void => {
		console.log(values.json ? JSON.stringify({ command, ...data }) : text)
	}

	if (command === 'init') {
		const accent = values.accent && {
			light: values.accent,
			dark: values['accent-dark'] ?? values.accent,
		}
		const written = await generateDocsSite(pkg, dir, {
			accent: accent || undefined,
			tagline: values.tagline,
			typedoc: values.typedoc,
			helpers: values.helpers,
			update: values.update,
		})
		report(
			{ ok: true, written },
			written.length
				? `wrote:\n${written.map((f) => `  ${f}`).join('\n')}`
				: 'nothing to write — already scaffolded'
		)
		return 0
	}
	if (command === 'brand') {
		// ponytail: deprecated alias, exits 0 so scripts don't break; remove in the next major.
		const hint =
			'shared-docs brand is deprecated — run `npx @rtorcato/brand-kit`, then `shared-docs init` to copy the assets into apps/docs'
		if (values.json) report({ ok: true, deprecated: true, written: [], hint }, hint)
		else console.error(hint)
		return 0
	}
	if (command === 'doctor') {
		const checks = await doctor(dir)
		const failed = checks.filter((c) => c.status === 'fail').length
		report(
			{ ok: failed === 0, checks },
			checks
				.map(
					(c) =>
						`${{ ok: 'ok  ', warn: 'warn', fail: 'FAIL' }[c.status]} ${c.check}${c.detail ? ` — ${c.detail}` : ''}`
				)
				.join('\n')
		)
		return failed ? 1 : 0
	}
	return fail(`unknown command "${command}"`)
}

main().then(
	(code) => process.exit(code),
	(err: unknown) => {
		console.error(err instanceof Error ? err.message : err)
		process.exit(1)
	}
)
