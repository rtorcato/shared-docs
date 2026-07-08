import Link from '@docusaurus/Link'
import CodeBlock from '@theme/CodeBlock'
import type { ReactElement } from 'react'
import CommandBlock from './CommandBlock.js'
import styles from './UseWithAI.module.css'

type UseWithAIProps = {
	/** GitHub repo "owner/name", e.g. "rtorcato/cf-common" — marketplace + AGENTS.md link. */
	repo: string
	/** Claude Code plugin id and marketplace id, e.g. "cf-common". */
	plugin: string
	/** Display name used in the intro line; defaults to `plugin`. */
	name?: string
	/** Pasteable rules for non-Claude agents (Cursor, Copilot, Codex…), Markdown. */
	rules: string
}

/**
 * "Use with AI" section — two lanes: Claude Code (marketplace + plugin install)
 * and other agents (bundled AGENTS.md / pasteable rules). Content is per-package,
 * passed via props; layout and styling are shared.
 */
export default function UseWithAI({
	repo,
	plugin,
	name = plugin,
	rules,
}: UseWithAIProps): ReactElement {
	return (
		<section className={styles.section}>
			<div className={styles.sectionHead}>
				<div>
					<h2 className={styles.h2}>Use with AI</h2>
					<p className={styles.sub}>
						A skill ships with the package so coding agents use {name} correctly — whichever tool
						you're in.
					</p>
				</div>
			</div>
			<div className={styles.aiGrid}>
				<div className={styles.aiLane}>
					<div className={styles.aiLaneHead}>Claude Code</div>
					<p className={styles.aiLaneSub}>Register the marketplace once, then install the plugin:</p>
					<CommandBlock
						commands={[`/plugin marketplace add ${repo}`, `/plugin install ${plugin}@${plugin}`]}
					/>
				</div>
				<div className={styles.aiLane}>
					<div className={styles.aiLaneHead}>Cursor, Copilot, Codex &amp; others</div>
					<p className={styles.aiLaneSub}>
						They read the bundled <code>AGENTS.md</code> from <code>node_modules</code> — or paste
						these rules into your agent config.
					</p>
					<div className={styles.aiRules}>
						<CodeBlock language="md">{rules}</CodeBlock>
					</div>
					<Link
						className={styles.aiLaneLink}
						href={`https://github.com/${repo}/blob/main/AGENTS.md`}
					>
						View AGENTS.md →
					</Link>
				</div>
			</div>
		</section>
	)
}
