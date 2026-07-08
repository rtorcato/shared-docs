import type { ReactElement } from 'react';
type UseWithAIProps = {
    /** GitHub repo "owner/name", e.g. "rtorcato/cf-common" — marketplace + AGENTS.md link. */
    repo: string;
    /** Claude Code plugin id and marketplace id, e.g. "cf-common". */
    plugin: string;
    /** Display name used in the intro line; defaults to `plugin`. */
    name?: string;
    /** Pasteable rules for non-Claude agents (Cursor, Copilot, Codex…), Markdown. */
    rules: string;
};
/**
 * "Use with AI" section — two lanes: Claude Code (marketplace + plugin install)
 * and other agents (bundled AGENTS.md / pasteable rules). Content is per-package,
 * passed via props; layout and styling are shared.
 */
export default function UseWithAI({ repo, plugin, name, rules, }: UseWithAIProps): ReactElement;
export {};
