import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'

export const exists = (file: string): Promise<boolean> =>
	stat(file).then(
		() => true,
		() => false
	)

export const read = (file: string): Promise<string> => readFile(file, 'utf8')

/** Write `contents` at `rel` under `dir` only when absent, so re-running never clobbers hand edits. */
export async function writeIfMissing(
	dir: string,
	rel: string,
	contents: string | Buffer,
	mode?: number
): Promise<string | null> {
	const file = path.join(dir, rel)
	if (await exists(file)) return null
	await mkdir(path.dirname(file), { recursive: true })
	await writeFile(file, contents, mode ? { mode } : undefined)
	return rel
}
