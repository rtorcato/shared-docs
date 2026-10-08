// Builds the docs.torcato.dev landing page into landing/dist from FAMILY, so the
// index can never drift from the sibling list every docs site already uses.
// Node 22 strips the types from family.ts natively; no build step needed.
import { mkdirSync, writeFileSync } from 'node:fs'
import { FAMILY, label } from '../src/family.ts'

const esc = (s) =>
	s.replace(
		/[&<>"']/g,
		(c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
	)

const cards = FAMILY.map(
	(m) => `      <a class="card" href="${esc(m.href)}">
        <span class="dest">${esc(m.dest)}</span>
        <h2 style="color:${esc(m.accent)}">${esc(label(m))}</h2>
        <p>${esc(m.tagline)}</p>
      </a>`
).join('\n')

const page = (title, lead) => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="Documentation for Richard Torcato's open-source packages.">
  <style>
    :root { color-scheme: dark; --bg: #0d1117; --card: #161b22; --border: #30363d; --text: #e6edf3; --muted: #8b949e; }
    * { box-sizing: border-box; }
    body { margin: 0; background: var(--bg); color: var(--text); font: 16px/1.5 system-ui, -apple-system, sans-serif; }
    main { max-width: 1040px; margin: 0 auto; padding: 56px 16px; }
    h1 { margin: 0 0 8px; font-size: 2rem; }
    .lead { margin: 0 0 32px; color: var(--muted); }
    .lead a { color: var(--text); }
    .grid { display: grid; gap: 16px; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }
    .card { position: relative; display: block; padding: 20px; background: var(--card); border: 1px solid var(--border); border-radius: 12px; color: inherit; text-decoration: none; transition: border-color .15s; }
    .card:hover, .card:focus-visible { border-color: var(--muted); }
    .card h2 { margin: 0 0 6px; font-size: 1.05rem; }
    .card p { margin: 0; color: var(--muted); font-size: .92rem; }
    .dest { position: absolute; top: 20px; right: 20px; color: var(--muted); font-size: .75rem; }
  </style>
</head>
<body>
  <main>
    <h1>${title}</h1>
    <p class="lead">${lead}</p>
    <div class="grid">
${cards}
    </div>
  </main>
</body>
</html>
`

mkdirSync('dist', { recursive: true })
writeFileSync(
	'dist/index.html',
	page(
		'docs.torcato.dev',
		'Documentation for my open-source packages. By <a href="https://torcato.dev">Richard Torcato</a>.'
	)
)
// Served for any docs.torcato.dev path no project's route claims, e.g. a site not deployed yet.
writeFileSync(
	'dist/404.html',
	page('Page not found', 'Nothing is published at this address. Try one of these.')
)
// Sites that moved hosts. Old links live on in published npm READMEs, so redirect them.
writeFileSync(
	'dist/_redirects',
	'/repo-ai https://docs.infrazero.dev/repo-ai/ 301\n/repo-ai/* https://docs.infrazero.dev/repo-ai/:splat 301\n'
)
console.log(`landing: ${FAMILY.length} projects → dist/`)
