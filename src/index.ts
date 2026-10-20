import { FAMILY, type FamilyMember, label } from './family.js'
import { COFFEE, HOME } from './home.js'

export { FAMILY, label } from './family.js'
export type { FamilyMember } from './family.js'
export { HOME } from './home.js'

/** A nav/footer link item — the neutral `{ label, href }` shape (works in Docusaurus, Fumadocs, or any framework). */
export type FamilyLink = { label: string; href: string }

/**
 * The family minus one member (by package name) — for a site's "Sibling
 * projects" grid, which should exclude the site's own package.
 *
 * @param selfName - the consuming package's name, e.g. "@rtorcato/cf-common"
 */
export const siblings = (selfName: string): FamilyMember[] =>
	FAMILY.filter((m) => m.name !== selfName)

/**
 * Nav-dropdown / footer link items for the whole family (short label + href).
 * Spread into a navbar dropdown or footer column (Docusaurus, Fumadocs, or any framework).
 */
export const projectFamilyItems = (): FamilyLink[] =>
	FAMILY.map((m) => ({ label: label(m), href: m.href }))

/** The @rtorcato GitHub profile — nav "All on GitHub →" + footer links. */
export const GITHUB_PROFILE = 'https://github.com/rtorcato'

/**
 * Standard docs-site footer copyright line, stamped with the current year.
 *
 * @param builtWith - the framework named in the "Built with …" suffix.
 *   Defaults to `'Docusaurus'` so existing sites are unchanged; a Fumadocs
 *   site passes `copyright('Fumadocs')`.
 */
export const copyright = (builtWith = 'Docusaurus'): string =>
	`Copyright © ${new Date().getFullYear()} Richard Torcato. Built with ${builtWith}.`

/**
 * Docusaurus `footer.copyright` (rendered as HTML): a `← torcato.dev · Buy me a coffee`
 * line above the plain-text {@link copyright}. Styled by the `@rtorcato/shared-docs/docusaurus` plugin.
 *
 * @param builtWith - forwarded to {@link copyright}
 */
export const footerCopyright = (builtWith?: string): string =>
	`<div class="rt-home-footer"><a href="${HOME.href}">← ${HOME.label}</a><span class="rt-home-dot" aria-hidden="true">·</span><a href="${COFFEE.href}" target="_blank" rel="noopener noreferrer" aria-label="${COFFEE.label} (opens in new tab)"><svg class="rt-home-coffee" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><!-- lucide coffee, ISC --><path d="M10 2v2"/><path d="M14 2v2"/><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"/><path d="M6 2v2"/></svg>${COFFEE.label}</a></div>${copyright(builtWith)}`
