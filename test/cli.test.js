// End-to-end: run the built CLI against a throwaway repo.
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
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

test('brand writes the SVG sources', () => {
	const dir = repo()
	run(dir, 'brand', '--tagline', 'Short tagline', '--accent', '#e879f9')
	const banner = readFileSync(join(dir, 'brand/banner.svg'), 'utf8')
	assert.match(banner, /#e879f9/)
	assert.match(banner, /Short tagline/)
})

test('a bad --accent is rejected', () => {
	assert.equal(run(repo(), 'init', '--accent', 'red').status, 1)
})
