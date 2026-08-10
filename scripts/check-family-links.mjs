// Fetches every FAMILY href and fails if any is unreachable.
//
// Deliberately NOT part of `pnpm test`: the unit tests check shape only, so
// they stay offline and can't fail a PR because someone else's Pages deploy is
// down. This runs on a schedule instead — #7 happened because four hrefs went
// dead and nothing noticed, which is a slow drift, not a per-commit risk.
import { FAMILY } from '../dist/index.js'

const TIMEOUT_MS = 15_000

/** HEAD first — GitHub Pages answers it and it saves pulling the body. Some
 *  hosts reject HEAD with 405, so fall back to GET before calling it dead. */
async function probe(url) {
	for (const method of ['HEAD', 'GET']) {
		try {
			const res = await fetch(url, {
				method,
				redirect: 'follow',
				signal: AbortSignal.timeout(TIMEOUT_MS),
			})
			if (res.ok) return { ok: true, status: res.status }
			if (method === 'GET') return { ok: false, status: res.status }
		} catch (err) {
			if (method === 'GET') return { ok: false, status: err.name === 'TimeoutError' ? 'timeout' : err.message }
		}
	}
	return { ok: false, status: 'unknown' }
}

const results = await Promise.all(
	FAMILY.map(async (m) => ({ ...m, ...(await probe(m.href)) }))
)

for (const r of results) {
	console.log(`${r.ok ? 'ok  ' : 'DEAD'}  ${String(r.status).padEnd(7)}  ${r.name}  ${r.href}`)
}

const dead = results.filter((r) => !r.ok)
if (dead.length > 0) {
	console.error(`\n${dead.length} of ${FAMILY.length} FAMILY hrefs are unreachable.`)
	console.error('Every sibling docs site renders these in its nav, footer, and landing grid.')
	process.exit(1)
}
console.log(`\nAll ${FAMILY.length} FAMILY hrefs resolve.`)
