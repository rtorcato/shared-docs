import type { ReactElement } from 'react';
type SiblingsProps = {
    /** The consuming package's own name, excluded from the grid — e.g. "@rtorcato/cf-common". */
    self: string;
};
/** The "Sibling projects" section: cross-links to the rest of the @rtorcato family. */
export default function Siblings({ self }: SiblingsProps): ReactElement;
export {};
