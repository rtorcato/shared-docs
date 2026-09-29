// End-to-end: run the built CLI against a throwaway repo.
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'

const cli = new URL('../dist/cli/index.js', import.meta.url).pathname
const run = (dir, ...args) => spawnSync('node', [cli, ...args, '--dir', dir], { encoding: 'utf8' })

function repo() {
	const dir = mkdtempSync(join(tmpdir(), 'shared-docs-'))
	writeFileSync(
		join(dir, 'package.json'),
		JSON.stringify({ name: '@rtorcato/api-common', description: 'x' })
	)
	return dir
}

test('init scaffolds a site wired to shared-docs, and is idempotent', () => {
	const dir = repo()
	const first = JSON.parse(run(dir, 'init', '--json', '--yes').stdout)
	assert.ok(first.written.includes('apps/docs/docusaurus.config.ts'))
	const config = readFileSync(join(dir, 'apps/docs/docusaurus.config.ts'), 'utf8')
	assert.match(config, /projectFamilyItems/)
	assert.match(config, /copyright\(\)/)
	assert.deepEqual(JSON.parse(run(dir, 'init', '--json').stdout).written, [])
})

test('doctor passes after init and fails on drift; --json is parseable', () => {
	const dir = repo()
	run(dir, 'init')
	const ok = run(dir, 'doctor', '--json')
	assert.equal(ok.status, 0)
	writeFileSync(join(dir, 'apps/docs/docusaurus.config.ts'), 'export default {}\n')
	const bad = run(dir, 'doctor', '--json')
	assert.equal(bad.status, 1)
	assert.ok(JSON.parse(bad.stdout).checks.some((c) => c.status === 'fail'))
})

test('docs.yml pins repo-tooling; doctor warns on @main and --update leaves it', () => {
	const dir = repo()
	run(dir, 'init')
	const wf = join(dir, '.github/workflows/docs.yml')
	assert.match(readFileSync(wf, 'utf8'), /docs-deploy\.yml@v\d+\.\d+\.\d+\n/)
	const pin = (c) => c.check.startsWith('.github/workflows/docs.yml pins')
	assert.equal(JSON.parse(run(dir, 'doctor', '--json').stdout).checks.find(pin).status, 'ok')
	const unpinned = readFileSync(wf, 'utf8').replace(/docs-deploy\.yml@\S+/, 'docs-deploy.yml@main')
	writeFileSync(wf, unpinned)
	assert.equal(JSON.parse(run(dir, 'doctor', '--json').stdout).checks.find(pin).status, 'warn')
	run(dir, 'init', '--update')
	assert.equal(readFileSync(wf, 'utf8'), unpinned)
})

test('init --update replaces a drifted shipped asset but not the config', () => {
	const dir = repo()
	run(dir, 'init')
	const theme = join(dir, 'apps/docs/src/css/theme.css')
	const cfg = join(dir, 'apps/docs/docusaurus.config.ts')
	const shipped = readFileSync(theme, 'utf8')
	writeFileSync(theme, '/* drifted */\n')
	writeFileSync(cfg, 'export default {}\n')
	assert.deepEqual(JSON.parse(run(dir, 'init', '--json').stdout).written, [])
	const { written } = JSON.parse(run(dir, 'init', '--update', '--json').stdout)
	assert.deepEqual(written, ['apps/docs/src/css/theme.css'])
	assert.equal(readFileSync(theme, 'utf8'), shipped)
	assert.equal(readFileSync(cfg, 'utf8'), 'export default {}\n')
})

test('brand is a deprecated alias that points at brand-kit and exits 0', () => {
	const dir = repo()
	const r = run(dir, 'brand')
	assert.equal(r.status, 0)
	assert.match(r.stderr, /npx @rtorcato\/brand-kit/)
})

test('init copies brand-kit output into apps/docs, and doctor checks it', () => {
	const dir = repo()
	mkdirSync(join(dir, 'brand'))
	writeFileSync(join(dir, 'brand/favicon.svg'), '<svg/>')
	const { written } = JSON.parse(run(dir, 'init', '--json').stdout)
	assert.ok(written.includes('apps/docs/static/img/favicon.svg'))
	const { checks } = JSON.parse(run(dir, 'doctor', '--json').stdout)
	assert.equal(checks.find((c) => c.check === 'apps/docs/static/img/favicon.svg')?.status, 'ok')
	assert.ok(!checks.some((c) => c.check.startsWith('brand/')))
})

test('doctor skips the docs checks when apps/docs is absent', () => {
	const r = run(repo(), 'doctor', '--json')
	assert.equal(r.status, 0)
	assert.deepEqual(
		JSON.parse(r.stdout).checks.map((c) => c.status),
		['warn']
	)
})

test('a bad --accent is rejected', () => {
	assert.equal(run(repo(), 'init', '--accent', 'red').status, 1)
})
