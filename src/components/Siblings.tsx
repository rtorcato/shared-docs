import Link from '@docusaurus/Link'
import type { ReactElement } from 'react'
import { siblings } from '../index.js'
import styles from './Siblings.module.css'

type SiblingsProps = {
	/** The consuming package's own name, excluded from the grid — e.g. "@rtorcato/cf-common". */
	self: string
}

/** The "Sibling projects" section: cross-links to the rest of the @rtorcato family. */
export default function Siblings({ self }: SiblingsProps): ReactElement {
	return (
		<section className={styles.section}>
			<div className={styles.sectionHead}>
				<div>
					<h2 className={styles.h2}>Sibling projects</h2>
					<p className={styles.sub}>
						More from <code>@rtorcato</code> — same conventions, same release pipeline.
					</p>
				</div>
			</div>
			<div className={styles.siblingGrid}>
				{siblings(self).map((s) => (
					<Link key={s.name} href={s.href} className={styles.card}>
						<div className={styles.cardHead}>
							<div className={styles.cardName} style={{ color: s.accent }}>
								{s.name}
							</div>
							<div className={styles.cardCount}>{s.dest} ↗</div>
						</div>
						<p className={styles.cardDesc}>{s.tagline}</p>
					</Link>
				))}
			</div>
		</section>
	)
}
