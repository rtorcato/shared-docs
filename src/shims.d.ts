// Ambient shims so the component sources typecheck standalone without pulling
// the full Docusaurus/Infima type packages. The real modules resolve in the
// consuming Docusaurus site at its own build time.

declare module '*.module.css' {
	const classes: { readonly [key: string]: string }
	export default classes
}

declare module '@docusaurus/Link' {
	import type { ComponentProps, ReactElement } from 'react'
	export default function Link(props: ComponentProps<'a'> & { to?: string }): ReactElement
}

declare module '@theme/CodeBlock' {
	import type { ReactElement, ReactNode } from 'react'
	export default function CodeBlock(props: {
		language?: string
		className?: string
		children?: ReactNode
	}): ReactElement
}
