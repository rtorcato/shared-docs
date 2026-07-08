// Single source of truth for the @rtorcato open-source family.
//
// Consumed by every sibling docs site (both the Node-side Docusaurus config and
// the browser-side landing page). Edit the family in ONE place: here.

export type FamilyMember = {
	/** npm package name, e.g. "@rtorcato/api-common" */
	name: string
	tagline: string
	/** Prefer the published docs site; fall back to the GitHub repo when there isn't one yet. */
	href: string
	/** Short label rendered in the card's top-right indicating where the link goes. */
	dest: 'Docs' | 'GitHub'
	/** Each project's brand hue (brightened for the dark card), used to tint the card title. */
	accent: string
}

/** Short nav/footer label, derived from the package name — no redundant field. */
export const label = (m: FamilyMember): string => m.name.replace('@rtorcato/', '')

export const FAMILY: FamilyMember[] = [
	{
		name: '@rtorcato/js-common',
		tagline: 'Tree-shakeable TypeScript utilities — tiny bundles, full type safety, CLI included.',
		href: 'https://rtorcato.github.io/js-common/',
		dest: 'Docs',
		accent: '#f2cc60',
	},
	{
		name: '@rtorcato/api-common',
		tagline:
			'Framework-agnostic building blocks for Node.js APIs — errors, auth, rate limiting, OpenAPI, Express + Hono.',
		href: 'https://rtorcato.github.io/api-common/',
		dest: 'Docs',
		accent: '#e879f9',
	},
	{
		name: '@rtorcato/browser-common',
		tagline:
			'Tree-shakeable TypeScript wrappers around 40+ browser Web APIs — one subpath per spec.',
		href: 'https://rtorcato.github.io/browser-common/',
		dest: 'Docs',
		accent: '#58a6ff',
	},
	{
		name: '@rtorcato/db-common',
		tagline: 'Shared, tree-shakeable TypeScript database utilities for Node projects.',
		href: 'https://rtorcato.github.io/db-common/',
		dest: 'Docs',
		accent: '#a78bfa',
	},
	{
		name: '@rtorcato/cf-common',
		tagline: 'Typed TypeScript wrappers and helpers for Cloudflare bindings and APIs.',
		href: 'https://rtorcato.github.io/cf-common/',
		dest: 'Docs',
		accent: '#fbad41',
	},
	{
		name: '@rtorcato/react-common',
		tagline: 'Published React 19 component library — shared UI primitives.',
		href: 'https://github.com/rtorcato/react-common',
		dest: 'GitHub',
		accent: '#818cf8',
	},
	{
		name: '@rtorcato/swift-common',
		tagline: 'SwiftUI package of reusable views and helpers to build apps faster.',
		href: 'https://rtorcato.github.io/swift-common/',
		dest: 'Docs',
		accent: '#ff6f4d',
	},
	{
		name: '@rtorcato/js-tooling',
		tagline: 'Shared Biome, TypeScript and Vitest presets that power the @rtorcato/* family.',
		href: 'https://rtorcato.github.io/js-tooling/',
		dest: 'Docs',
		accent: '#34d399',
	},
]
