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
