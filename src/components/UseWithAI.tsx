import Link from '@docusaurus/Link'
import type { ReactElement } from 'react'
import CommandBlock from './CommandBlock.js'
import styles from './UseWithAI.module.css'

type UseWithAIProps = {
	/** GitHub repo "owner/name", e.g. "rtorcato/cf-common" — marketplace + AGENTS.md link. */
	repo: string
	/** Claude Code plugin id and marketplace id, e.g. "cf-common". */
	plugin: string
	/** npm package name, e.g. "@rtorcato/cf-common" — used for the AGENTS.md path. */
	pkg: string
	/** Skill directory name under `skills/`; defaults to `plugin`. */
	skill?: string
	/** Display name used in the intro line; defaults to `plugin`. */
	name?: string
	/** Overrides the intro line — say what the skill actually teaches, if it is worth saying. */
	blurb?: string
}

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
export default function UseWithAI({
	repo,
	plugin,
	pkg,
	skill = plugin,
	name = plugin,
	blurb,
}: UseWithAIProps): ReactElement {
	const targets = [
		{
			title: 'Any coding agent',
			desc: <>Pull the skill into any tool the skills CLI supports.</>,
			commands: [`npx skills add https://github.com/${repo} --skill ${skill}`],
		},
		{
			title: 'Claude Code',
			desc: <>The repo is its own plugin marketplace — add it, then install the skill.</>,
			commands: [`/plugin marketplace add ${repo}`, `/plugin install ${plugin}@${plugin}`],
		},
		{
			title: 'Cursor, Copilot, Codex',
			desc: (
				<>
					They read <code>AGENTS.md</code>. It ships in the npm tarball, so it is already in your{' '}
					<code>node_modules</code>.
				</>
			),
			commands: [`node_modules/${pkg}/AGENTS.md`],
		},
	]

	return (
		<section className={styles.section}>
			<div className={styles.sectionHead}>
				<div>
					<h2 className={styles.h2}>Use with AI</h2>
					<p className={styles.sub}>
						{blurb ??
							`A skill ships with the package so coding agents use ${name} correctly — whichever tool you're in.`}
					</p>
				</div>
				<Link className={styles.viewAll} href={`https://github.com/${repo}/blob/main/AGENTS.md`}>
					Read the rules →
				</Link>
			</div>
			<div className={styles.aiStack}>
				{targets.map((t) => (
					<div key={t.title} className={styles.card}>
						<div className={styles.cardTitle}>{t.title}</div>
						<div className={styles.cardDesc}>{t.desc}</div>
						<div className={styles.cmds}>
							<CommandBlock commands={t.commands} />
						</div>
					</div>
				))}
			</div>
		</section>
	)
}
