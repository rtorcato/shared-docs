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
 * Spread into a Docusaurus navbar dropdown or footer column.
 */
export const projectFamilyItems = () => FAMILY.map((m) => ({ label: label(m), href: m.href }));
