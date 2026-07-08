import { type ReactElement } from 'react';
/** Copy / checkmark icon — shared with CommandBlock. */
export declare function CopyIcon({ done }: {
    done: boolean;
}): ReactElement;
type InstallTabsProps = {
    /** The package to install, e.g. "@rtorcato/cf-common". */
    pkg: string;
};
export default function InstallTabs({ pkg }: InstallTabsProps): ReactElement;
export {};
