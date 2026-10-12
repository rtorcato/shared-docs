// Builds the docs.torcato.dev landing page into docs/site/dist from FAMILY, so the
// index can never drift from the sibling list every docs site already uses.
// Node 22 strips the types from family.ts natively; no build step needed.
import { mkdirSync, writeFileSync } from 'node:fs'
import { FAMILY, label } from '../../src/family.ts'

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

// Classify projects into groups: toolchain vs libraries
const GROUPS = {
	tool: ['repo-tooling', 'brand-kit'],
	lib: ['js-common', 'api-common', 'browser-common', 'db-common', 'cf-common', 'react-common', 'swift-common', 'supabase-common'],
}

const projects = FAMILY.map((m) => ({
	id: label(m),
	name: m.name,
	accent: m.accent,
	tag: m.tagline,
	href: m.href,
	dest: m.dest,
	group: Object.entries(GROUPS).find(([, ids]) => ids.includes(label(m)))?.[0] || 'lib',
}))

// Generate data.js for 404.html
const dataJs = `const PROJECTS = ${JSON.stringify(projects)};
const byGroup = (g) => PROJECTS.filter((p) => p.group === g);
`

const page404 = `<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Not found · docs.torcato.dev</title>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700;800&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet">
<script>${dataJs}</script>
<style>
  :root { --bg:#0a0e16; --bg2:#0d131d; --surface:#111824; --border:rgba(255,255,255,.08); --border2:rgba(255,255,255,.14); --heading:#fff; --text:#dfe5ee; --muted:#9aa5b5; --faint:#6b7687 }
  * { box-sizing:border-box }
  body { margin:0; background:var(--bg); color:var(--text); font:16px/1.6 Geist, system-ui, sans-serif }
  a { color:inherit; text-decoration:none }
  .tile { display:inline-grid; place-items:center; color:#0a0e16; font-weight:800; width:44px; height:44px; border-radius:11px; font-size:11px; flex:none }
  .navbar { height:60px; border-bottom:1px solid var(--border); display:flex; align-items:center; gap:24px; padding:0 24px; font-size:15px; font-weight:500 }
  .navbar .logo { display:flex; align-items:center; gap:10px; font-weight:700; color:#fff; margin-right:8px }
  .navbar .logo b { width:28px; height:28px; border-radius:7px; background:#fff; color:#0a0e16; display:grid; place-items:center; font:800 14px Geist }
  .navbar .r { margin-left:auto; display:flex; gap:22px; align-items:center; color:var(--muted) }
  .navbar .dd::after { content:' ▾'; font-size:11px }
  .toggle { width:36px; height:36px; display:grid; place-items:center; border-radius:50%; color:var(--muted) }
  .wrap { max-width:1140px; margin:0 auto; padding:0 24px }
  .m { text-align:center; padding:72px 0 8px }
  .shelf { display:inline-flex; gap:10px; padding:16px; border:1px solid var(--border); border-radius:18px; background:var(--bg2); margin-bottom:28px }
  .shelf .tile { opacity:.9 }
  .shelf .gap { width:44px; height:44px; border-radius:11px; border:2px dashed var(--muted); display:grid; place-items:center; font:800 20px Geist; color:var(--muted) }
  .m h1 { margin:0 0 10px; font-size:38px; letter-spacing:-.03em; color:#fff; font-weight:800 }
  .m p { margin:0 auto 26px; color:var(--muted); font-size:17px; max-width:36em }
  .m .eb { font:500 12.5px 'Geist Mono'; color:var(--faint); letter-spacing:.06em; margin-bottom:12px }
  .acts { display:flex; gap:12px; justify-content:center }
  .btn { height:44px; padding:0 18px; border-radius:10px; display:inline-flex; align-items:center; gap:8px; white-space:nowrap; font-weight:600; font-size:15px }
  .btn.p { background:#fff; color:#0a0e16 } .btn.s { border:1px solid var(--border2); color:#fff }
  .btn:focus-visible { outline:2px solid #fff; outline-offset:2px }
  h2 { font-size:13px; font-family:'Geist Mono'; font-weight:500; letter-spacing:.08em; text-transform:uppercase; color:var(--muted); margin:40px 0 14px; display:flex; gap:12px; align-items:center }
  h2::after { content:''; flex:1; height:1px; background:var(--border) }
  .grid { display:grid; grid-template-columns:repeat(3, minmax(0,1fr)); gap:14px }
  .card { background:var(--surface); border:1px solid var(--border); border-radius:14px; padding:18px; display:flex; flex-direction:column; gap:10px; transition:border-color .15s, transform .15s }
  .card:hover, .card:focus-visible { border-color:color-mix(in srgb, var(--a) 55%, transparent); transform:translateY(-2px) }
  .card .top { display:flex; align-items:center; gap:12px }
  .card h3 { margin:0; font-size:16.5px; color:#fff }
  .card .v { margin-left:auto; font:12px 'Geist Mono'; color:var(--faint); border:1px solid var(--border); border-radius:99px; padding:1px 8px }
  .card p { margin:0; font-size:14px; color:var(--muted); flex:1 }
  .card .f { display:flex; justify-content:space-between; font-size:13.5px; color:var(--muted) }
  .card .f b { color:var(--a); font-weight:600 }
  .card.gh .f b { color:var(--muted) }
  footer { margin-top:72px; border-top:1px solid var(--border); background:var(--bg2) }
  footer .wrap { display:grid; grid-template-columns:repeat(4, 1fr); gap:24px; padding-top:40px; padding-bottom:40px; font-size:14px; color:var(--muted) }
  footer h4 { margin:0 0 10px; color:#fff; font-size:14px }
  footer a { display:block; line-height:1.9 }
  .copy { text-align:center; font-size:13px; color:var(--faint); padding:0 0 32px }
  code.path { font:500 .9em 'Geist Mono'; color:#fff; background:var(--bg2); border:1px solid var(--border2); border-radius:7px; padding:1px 8px }
</style>
</head>
<body>
<nav class="navbar">
  <a class="logo" href="/"><b>T</b>docs.torcato.dev</a>
  <span class="dd">Projects</span><span>torcato.dev</span>
  <div class="r"><span>GitHub ↗</span><span class="toggle">◐</span></div>
</nav>
<div class="wrap">
  <div class="m">
    <div class="shelf" id="shelf" aria-hidden="true"></div>
    <div class="eb">404 · NOT FOUND</div>
    <h1 id="title"></h1>
    <p id="sub"></p>
    <div class="acts" id="acts"></div>
  </div>
  <div id="sections"></div>
</div>
<footer>
  <div class="wrap">
    <div><h4>Toolchain</h4><div id="f-tool"></div></div>
    <div><h4>Libraries</h4><div id="f-lib1"></div></div>
    <div><h4>&nbsp;</h4><div id="f-lib2"></div></div>
    <div><h4>More</h4><a href="/">torcato.dev</a><a href="https://github.com/rtorcato">GitHub</a></div>
  </div>
  <div class="copy">© 2026 Richard Torcato · Built with shared-docs</div>
</footer>
<script>
  const pending = new Set(['repo-ai', 'shared-docs'])
  const tile = (p, size, fontSize) => {
    const ghMark = pending.has(p.id) ? '◆' : p.id[0].toUpperCase()
    return \`<span class="tile" style="width:\${size}px;height:\${size}px;font-size:\${fontSize}px;background:\${p.accent};--a:\${p.accent}">\${ghMark}</span>\`
  }
  const card = (p) => {
    const gh = pending.has(p.id)
    return \`<a class="card\${gh ? ' gh' : ''}" style="--a:\${p.accent}" href="\${p.href}">
      <div class="top">\${tile(p, 34, 9)}<h3>\${p.id}</h3></div>
      <p>\${p.tag}</p>
      <div class="f"><b>\${gh ? 'GitHub ↗' : 'Read the docs →'}</b></div></a>\`
  }
  const seg = location.pathname.split('/')[1]
  const hit = PROJECTS.find((p) => p.id === seg)
  const row = [...byGroup('tool'), ...byGroup('lib')]
  shelf.innerHTML = row.map((p) => (p === hit ? \`<span class="gap">\${p.id[0].toUpperCase()}</span>\` : tile(p, 44, 11))).join('') + (hit ? '' : '<span class="gap">?</span>')
  title.textContent = hit ? \`\${hit.id} isn't on the shelf yet\` : "This page isn't on the shelf"
  sub.innerHTML = hit ? \`Its docs site hasn't been deployed to <code class="path">/\${hit.id}/</code>.\` : 'It may have moved, or the project hasn\\'t published docs yet.'
  acts.innerHTML = (hit ? \`<a class="btn p" href="https://github.com/rtorcato/\${hit.id}">README on GitHub ↗</a>\` : '') + '<a class="btn s" href="/">All docs</a>'
  sections.innerHTML = \`<h2>\${hit ? 'Or browse the docs' : 'Try one of these'}</h2><div class="grid">\${[...byGroup('tool'), ...byGroup('lib')].filter((p) => p !== hit).map(card).join('')}</div>\`
  const link = (p) => \`<a href="\${p.href}">\${p.id}</a>\`
  document.getElementById('f-tool').innerHTML = byGroup('tool').map(link).join('')
  const libs = byGroup('lib')
  document.getElementById('f-lib1').innerHTML = libs.slice(0, 4).map(link).join('')
  document.getElementById('f-lib2').innerHTML = libs.slice(4).map(link).join('')
</script>
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
writeFileSync('dist/404.html', page404)
// Sites that moved hosts. Old links live on in published npm READMEs, so redirect them.
writeFileSync(
	'dist/_redirects',
	'/repo-ai https://docs.infrazero.dev/repo-ai/ 301\n/repo-ai/* https://docs.infrazero.dev/repo-ai/:splat 301\n'
)
console.log(`landing: ${FAMILY.length} projects → dist/`)
