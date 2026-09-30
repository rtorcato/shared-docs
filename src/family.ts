// Single source of truth for the @rtorcato open-source family.
//
// Framework-neutral data — consumed by every sibling docs site (the Node-side
// config and the browser-side landing page) regardless of framework
// (Docusaurus, Fumadocs, …). Edit the family in ONE place: here.

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
		href: 'https://docs.torcato.dev/js-common/',
		dest: 'Docs',
		accent: '#f2cc60',
	},
	{
		name: '@rtorcato/api-common',
		tagline:
			'Framework-agnostic building blocks for Node.js APIs — errors, auth, rate limiting, OpenAPI, Express + Hono.',
		href: 'https://docs.torcato.dev/api-common/',
		dest: 'Docs',
		accent: '#e879f9',
	},
	{
		name: '@rtorcato/browser-common',
		tagline:
			'Tree-shakeable TypeScript wrappers around 40+ browser Web APIs — one subpath per spec.',
		href: 'https://docs.torcato.dev/browser-common/',
		dest: 'Docs',
		accent: '#58a6ff',
	},
	{
		name: '@rtorcato/db-common',
		tagline: 'Shared, tree-shakeable TypeScript database utilities for Node projects.',
		href: 'https://docs.torcato.dev/db-common/',
		dest: 'Docs',
		accent: '#a78bfa',
	},
	{
		name: '@rtorcato/cf-common',
		tagline: 'Typed TypeScript wrappers and helpers for Cloudflare bindings and APIs.',
		href: 'https://docs.torcato.dev/cf-common/',
		dest: 'Docs',
		accent: '#fbad41',
	},
	{
		name: '@rtorcato/react-common',
		tagline: 'Published React 19 component library — shared UI primitives.',
		href: 'https://docs.torcato.dev/react-common/',
		dest: 'Docs',
		accent: '#818cf8',
	},
	{
		name: '@rtorcato/swift-common',
		tagline: 'SwiftUI package of reusable views and helpers to build apps faster.',
		href: 'https://docs.torcato.dev/swift-common/',
		dest: 'Docs',
		accent: '#ff6f4d',
	},
	{
		name: '@rtorcato/supabase-common',
		tagline:
			'Shared, tree-shakeable TypeScript helpers for Supabase — client, auth, and database utilities.',
		href: 'https://docs.torcato.dev/supabase-common/',
		dest: 'Docs',
		accent: '#3ecf8e',
	},
	{
		name: '@rtorcato/repo-tooling',
		tagline:
			'One wizard to scaffold TypeScript, linting, testing, and releases for any JS project.',
		href: 'https://docs.torcato.dev/repo-tooling/',
		dest: 'Docs',
		accent: '#22d3ee',
	},
	{
		name: '@rtorcato/repo-ai',
		tagline:
			'Turns ai-ready GitHub issues into reviewed PRs — one worktree per issue, two agent reviewers.',
		href: 'https://docs.torcato.dev/repo-ai/',
		dest: 'Docs',
		accent: '#f472b6',
	},
	{
		name: '@rtorcato/db-x',
		tagline: 'Production-grade database schema deployment with the ergonomics of a JSX component.',
		href: 'https://docs.torcato.dev/db-x/',
		dest: 'Docs',
		accent: '#10b981',
	},
	{
		name: '@rtorcato/brand-kit',
		tagline:
			'Banner, social card and favicon for a repo — SVG sources you can regenerate, rendered to PNG.',
		href: 'https://github.com/rtorcato/brand-kit',
		dest: 'GitHub',
		accent: '#a3e635',
	},
	// infra-x moved to the private `infrazero` org, so every public link to it 404s.
	// Restore this entry (with its new home) if it goes public again.
	// {
	// 	name: '@rtorcato/infra-x',
	// 	tagline: 'JSX as the deployment language — runtime and reference component libraries.',
	// 	href: 'https://github.com/rtorcato/infra-x',
	// 	dest: 'GitHub',
	// 	accent: '#2dd4bf',
	// },
]
