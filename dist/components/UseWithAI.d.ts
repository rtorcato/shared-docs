import type { ReactElement } from 'react';
type UseWithAIProps = {
    /** GitHub repo "owner/name", e.g. "rtorcato/cf-common" — marketplace + AGENTS.md link. */
    repo: string;
    /** Claude Code plugin id and marketplace id, e.g. "cf-common". */
    plugin: string;
    /** npm package name, e.g. "@rtorcato/cf-common" — used for the AGENTS.md path. */
    pkg: string;
    /** Skill directory name under `skills/`; defaults to `plugin`. */
    skill?: string;
    /** Display name used in the intro line; defaults to `plugin`. */
    name?: string;
    /** Overrides the intro line — say what the skill actually teaches, if it is worth saying. */
    blurb?: string;
};
/**
 * "Use with AI" section — three cards, one per audience.
 *
 * Ordered by reach, not by our own tooling preference: the skills CLI works in
 * any tool that supports it, so it leads; the Claude Code marketplace is a
 * shortcut for one tool; AGENTS.md is last because that lane is "do nothing, it
 * already shipped in your node_modules" rather than a competing action.
 *
 * Content is per-package via props; layout and styling are shared.
 */
export default function UseWithAI({ repo, plugin, pkg, skill, name, blurb, }: UseWithAIProps): ReactElement;
export {};
