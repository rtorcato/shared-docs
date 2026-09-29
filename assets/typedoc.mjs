/**
 * Build one `docusaurus-plugin-typedoc` instance per subpath module, each
 * generating `docs/api/<id>/index.md` from that module's source JSDoc.
 * Written to `scripts/typedoc.mjs` by `shared-docs init --typedoc`; the docs app
 * needs `docusaurus-plugin-typedoc`, `typedoc` and `typedoc-plugin-markdown`.
 *
 * @param {string[]} modules - module ids, e.g. ['errors', 'env', 'kv']
 * @param {{ srcDir?: string, tsconfig?: string, overrides?: object }} [options]
 *   srcDir: dir holding `<id>/index.ts`, relative to the docs app (default '../../src').
 *   tsconfig: tsconfig for TypeDoc, relative to the docs app (default '../../tsconfig.json').
 * @returns {Array<[string, object]>} plugin tuples to spread into `plugins`.
 */
export const getTypedocPlugins = (modules, options = {}) => {
	const { srcDir = '../../src', tsconfig = '../../tsconfig.json', overrides = {} } = options
	return modules.map((id) => [
		'docusaurus-plugin-typedoc',
		{
			id,
			entryPoints: [`${srcDir}/${id}/index.ts`],
			tsconfig,
			// The library typechecks on its own toolchain; skip TypeDoc's redundant check.
			skipErrorChecking: true,
			out: `docs/api/${id}`,
			readme: 'none',
			includeVersion: false,
			excludePrivate: true,
			excludeInternal: true,
			excludeExternals: true,
			sort: ['source-order'],
			outputFileStrategy: 'modules',
			...overrides,
		},
	])
}
