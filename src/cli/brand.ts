/**
 * Brand assets are made by `@rtorcato/brand-kit` (`npx @rtorcato/brand-kit`),
 * which owns `brand/`. All shared-docs keeps is the file convention: copy the
 * favicon and social card from `brand/` into the docs site's `static/img`.
 */
import { copyFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { FAMILY, type FamilyMember } from '../family.js'
import { exists } from './fs.js'

/** This package's own family data, matched on the package name. */
export const familyEntry = (pkgName: string | undefined): FamilyMember | undefined =>
	FAMILY.find((m) => m.name === pkgName)

/** brand/ file → docs-site static/img file. The ico and card PNG exist only once rendered. */
export const DOCS_ASSETS = ['favicon.svg', 'favicon.ico', 'social-card.png']

/**
 * Copy the brand favicon and social card into the docs site's `static/img`.
 * Copy-if-missing, and a no-op without `apps/docs`, so brand-kit and `init`
 * reach the same tree in either order.
 */
export async function syncBrandToDocs(targetDir: string): Promise<string[]> {
	if (!(await exists(path.join(targetDir, 'apps', 'docs')))) return []
	const img = path.join('apps', 'docs', 'static', 'img')
	const written: string[] = []
	for (const name of DOCS_ASSETS) {
		const src = path.join(targetDir, 'brand', name)
		const dest = path.join(targetDir, img, name)
		if (!(await exists(src)) || (await exists(dest))) continue
		await mkdir(path.dirname(dest), { recursive: true })
		await copyFile(src, dest)
		written.push(path.join(img, name))
	}
	return written
}
