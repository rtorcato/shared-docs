// tsc doesn't copy non-TS assets, so mirror every src/**/*.module.css into dist/
// preserving structure. Run after tsc in the build script.
import { cpSync, mkdirSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'

const SRC = 'src'
const OUT = 'dist'

function walk(dir) {
	for (const entry of readdirSync(dir)) {
		const p = join(dir, entry)
		if (statSync(p).isDirectory()) walk(p)
		else if (p.endsWith('.module.css')) {
			const dest = join(OUT, relative(SRC, p))
			mkdirSync(dirname(dest), { recursive: true })
			cpSync(p, dest)
			console.log(`copied ${p} -> ${dest}`)
		}
	}
}

walk(SRC)
