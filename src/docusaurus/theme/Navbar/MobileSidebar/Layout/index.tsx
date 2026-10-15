import Layout from '@theme-init/Navbar/MobileSidebar/Layout'
import type { ComponentProps } from 'react'
import { HOME } from '../../../../../home.js'

// Wrapping Layout rather than PrimaryMenu: sites that swizzle PrimaryMenu with
// their own list still get the row, which is always first, above Docs.
export default function LayoutWithHome(props: ComponentProps<typeof Layout>) {
	return (
		<Layout
			{...props}
			primaryMenu={
				<>
					<ul className="menu__list rt-home-row">
						<li className="menu__list-item">
							<a className="menu__link" href={HOME.href}>
								← {HOME.label}
							</a>
						</li>
					</ul>
					{props.primaryMenu}
				</>
			}
		/>
	)
}
