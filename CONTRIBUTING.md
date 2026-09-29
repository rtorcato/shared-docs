# Contributing

## Setup

Node >= 22 and pnpm.

```sh
pnpm install
pnpm build       # tsc + copy CSS to dist/ (tests import dist/)
pnpm test
pnpm typecheck
pnpm lint
```

## Workflow

- One branch and one PR per issue, branched from `main`.
- PR titles must be [Conventional Commits](https://www.conventionalcommits.org/). The
  squash subject drives semantic-release: `feat:` cuts a minor, `fix:` a patch, and
  `chore:`/`docs:`/`ci:` cut no release. A change consumers need to install must be
  `feat:` or `fix:`.
- Do not bump `version` in `package.json` or tag by hand; releases are automatic.
- Run `pnpm build && pnpm test` before pushing.
- Editing `src/family.ts`? Check that every new `href` resolves (`pnpm check:links`).

## Security

Report vulnerabilities privately; see [SECURITY.md](SECURITY.md).
