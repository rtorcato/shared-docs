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
- PR titles must be [Conventional Commits](https://www.conventionalcommits.org/).
- A change consumers need to install carries a changeset: run `pnpm changeset`, pick
  the bump (patch/minor/major) and commit the file under `.changeset/`. `chore:`,
  `docs:` and `ci:` PRs need none.
- Do not bump `version` in `package.json` or tag by hand; the Version Packages PR does it.
- Merging does not release. Each push to `main` opens or updates the Version Packages
  PR; merging that PR is the release, after one approval in the `release` environment.
- Run `pnpm build && pnpm test` before pushing.
- Editing `src/family.ts`? Check that every new `href` resolves (`pnpm check:links`).

## Security

Report vulnerabilities privately; see [SECURITY.md](SECURITY.md).
