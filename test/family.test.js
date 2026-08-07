// Tests run against the built output, not src/ — dist/ is what consumers get,
// and index.js is pure data with no React or CSS, so plain node runs it.
// ponytail: node:test over a test framework — no transform step, no devDep.
// Reach for vitest if a component ever needs rendering.
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { FAMILY, GITHUB_PROFILE, copyright, label, projectFamilyItems, siblings } from '../dist/index.js'

test('siblings() drops the named member', () => {
	const self = '@rtorcato/js-common'
	const rest = siblings(self)
	assert.equal(rest.length, FAMILY.length - 1)
	assert.ok(!rest.some((m) => m.name === self))
})

test('siblings() returns the full list for a name not in FAMILY', () => {
	// Documenting the trap, not endorsing it: a consumer that typos its own
	// package name silently renders itself in its own "Sibling projects" grid.
	assert.deepEqual(siblings('@rtorcato/js-comon'), FAMILY)
})

test('label() strips the scope, and leaves an unscoped name alone', () => {
	assert.equal(label({ name: '@rtorcato/api-common' }), 'api-common')
	assert.equal(label({ name: 'db-x' }), 'db-x')
})

test('projectFamilyItems() covers every member', () => {
	const items = projectFamilyItems()
	assert.equal(items.length, FAMILY.length)
	assert.deepEqual(
		items,
		FAMILY.map((m) => ({ label: label(m), href: m.href })),
	)
})

test('every FamilyMember is well formed', () => {
	const names = new Set()
	for (const m of FAMILY) {
		const at = `FAMILY entry ${m.name}`
		assert.ok(m.name, 'every entry has a name')
		assert.ok(!names.has(m.name), `${at}: duplicate name`)
		names.add(m.name)

		assert.ok(m.tagline?.length > 0, `${at}: empty tagline`)
		assert.match(m.href, /^https:\/\/\S+$/, `${at}: href must be an https URL`)
		assert.ok(['Docs', 'GitHub'].includes(m.dest), `${at}: dest is "${m.dest}"`)
		assert.equal(
			m.dest === 'GitHub',
			m.href.startsWith('https://github.com/'),
			`${at}: dest "${m.dest}" disagrees with href ${m.href}`,
		)
		assert.match(m.accent, /^#[0-9a-f]{6}$/i, `${at}: accent must be a 6-digit hex`)
	}
	// ponytail: shape only — no network. #7 was about hrefs going dead, but
	// fetching ten URLs makes CI fail on someone else's outage. Add a scheduled
	// link-check workflow if the drift recurs.
})

test('copyright() names the framework and the current year', () => {
	const year = new Date().getFullYear()
	assert.equal(copyright(), `Copyright © ${year} Richard Torcato. Built with Docusaurus.`)
	assert.match(copyright('Fumadocs'), /Built with Fumadocs\.$/)
	assert.equal(GITHUB_PROFILE, 'https://github.com/rtorcato')
})
