// @theme-init, not @theme-original: from a theme plugin, @theme-original resolves to this file itself.
import Logo from '@theme-init/Navbar/Logo'
import type { ComponentProps } from 'react'
import { HOME } from '../../../../home.js'

// The breadcrumb ahead of the site logo. The separator is not a link.
export default function LogoWithHome(props: ComponentProps<typeof Logo>) {
	return (
		<>
			<a className="rt-home-crumb" href={HOME.href}>
				{HOME.label}
			</a>
			<span className="rt-home-sep" aria-hidden="true">
				/
			</span>
			<Logo {...props} />
		</>
	)
}
