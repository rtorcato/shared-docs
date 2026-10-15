import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { test } from 'node:test'
import plugin from '../dist/docusaurus/index.js'

test('docusaurus plugin points at theme overrides and a stylesheet that exist in dist/', () => {
	const p = plugin()
	const theme = p.getThemePath()
	assert.ok(existsSync(path.join(theme, 'Navbar/Logo/index.js')))
	assert.ok(existsSync(path.join(theme, 'Navbar/MobileSidebar/Layout/index.js')))
	assert.ok(p.getClientModules().every(existsSync))
})
