/** The link back to the personal site — the single source for the navbar breadcrumb, the mobile drawer row and the footer line. */
export const HOME = { label: 'torcato.dev', href: 'https://torcato.dev' } as const

/** The footer's "Buy me a coffee" link — only {@link footerCopyright} renders it. */
export const COFFEE = {
	label: 'Buy me a coffee',
	href: 'https://buymeacoffee.com/rtorcato',
} as const
