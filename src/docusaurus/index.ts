import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))

/**
 * Docusaurus plugin: the `torcato.dev /` breadcrumb before the site logo and a
 * `← torcato.dev` first row in the mobile drawer, via theme-component wrappers
 * (no swizzle in the site). Add it with `plugins: ['@rtorcato/shared-docs/docusaurus']`.
 */
export default function homeLinkPlugin() {
	return {
		name: '@rtorcato/shared-docs/docusaurus',
		getThemePath: () => path.join(here, 'theme'),
		getClientModules: () => [path.join(here, 'home-link.css')],
	}
}
