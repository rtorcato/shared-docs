export type FamilyMember = {
    /** npm package name, e.g. "@rtorcato/api-common" */
    name: string;
    tagline: string;
    /** Prefer the published docs site; fall back to the GitHub repo when there isn't one yet. */
    href: string;
    /** Short label rendered in the card's top-right indicating where the link goes. */
    dest: 'Docs' | 'GitHub';
    /** Each project's brand hue (brightened for the dark card), used to tint the card title. */
    accent: string;
};
/** Short nav/footer label, derived from the package name — no redundant field. */
export declare const label: (m: FamilyMember) => string;
export declare const FAMILY: FamilyMember[];
