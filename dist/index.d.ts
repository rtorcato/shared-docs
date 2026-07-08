import { type FamilyMember } from './family.js';
export { FAMILY, label } from './family.js';
export type { FamilyMember } from './family.js';
/** A nav/footer link item — matches Docusaurus's `{ label, href }` shape. */
export type FamilyLink = {
    label: string;
    href: string;
};
/**
 * The family minus one member (by package name) — for a site's "Sibling
 * projects" grid, which should exclude the site's own package.
 *
 * @param selfName - the consuming package's name, e.g. "@rtorcato/cf-common"
 */
export declare const siblings: (selfName: string) => FamilyMember[];
/**
 * Nav-dropdown / footer link items for the whole family (short label + href).
 * Spread into a Docusaurus navbar dropdown or footer column.
 */
export declare const projectFamilyItems: () => FamilyLink[];
/** The @rtorcato GitHub profile — nav "All on GitHub →" + footer links. */
export declare const GITHUB_PROFILE = "https://github.com/rtorcato";
/** Standard docs-site footer copyright line, stamped with the current year. */
export declare const copyright: () => string;
