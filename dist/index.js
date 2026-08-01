import { FAMILY, label } from './family.js';
export { FAMILY, label } from './family.js';
/**
 * The family minus one member (by package name) — for a site's "Sibling
 * projects" grid, which should exclude the site's own package.
 *
 * @param selfName - the consuming package's name, e.g. "@rtorcato/cf-common"
 */
export const siblings = (selfName) => FAMILY.filter((m) => m.name !== selfName);
/**
 * Nav-dropdown / footer link items for the whole family (short label + href).
 * Spread into a navbar dropdown or footer column (Docusaurus, Fumadocs, or any framework).
 */
export const projectFamilyItems = () => FAMILY.map((m) => ({ label: label(m), href: m.href }));
/** The @rtorcato GitHub profile — nav "All on GitHub →" + footer links. */
export const GITHUB_PROFILE = 'https://github.com/rtorcato';
/**
 * Standard docs-site footer copyright line, stamped with the current year.
 *
 * @param builtWith - the framework named in the "Built with …" suffix.
 *   Defaults to `'Docusaurus'` so existing sites are unchanged; a Fumadocs
 *   site passes `copyright('Fumadocs')`.
 */
export const copyright = (builtWith = 'Docusaurus') => `Copyright © ${new Date().getFullYear()} Richard Torcato. Built with ${builtWith}.`;
