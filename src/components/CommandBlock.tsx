import { type ReactElement, useState } from 'react'
import { CopyIcon } from './InstallTabs.js'
import styles from './CommandBlock.module.css'

type CommandBlockProps = {
	commands: string[]
}

function CommandRow({ cmd }: { cmd: string }): ReactElement {
	const [copied, setCopied] = useState(false)

	async function copy() {
		try {
			await navigator.clipboard.writeText(cmd)
		} catch {
			// Clipboard may be unavailable (e.g., insecure context) — ignore.
		}
		setCopied(true)
		setTimeout(() => setCopied(false), 1300)
	}

	return (
		<div className={styles.row}>
			<code className={styles.cmd}>{cmd}</code>
			<button
				type="button"
				className={styles.copy}
				onClick={copy}
				aria-label={copied ? 'Copied' : `Copy command: ${cmd}`}
				data-copied={copied}
			>
				<CopyIcon done={copied} />
			</button>
		</div>
	)
}

export default function CommandBlock({ commands }: CommandBlockProps): ReactElement {
	return (
		<div className={styles.wrap}>
			{commands.map((cmd) => (
				<CommandRow key={cmd} cmd={cmd} />
			))}
		</div>
	)
}
