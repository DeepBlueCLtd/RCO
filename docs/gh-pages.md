# Hosted demo and pull request previews (GitHub Pages)

The project's GitHub Pages site holds a demo of `main`, a preview of each
pull request, and frontend test coverage reports. Nothing on it needs a
server: each copy of the app carries its own backend, running in the browser.

## What is where

| Path                     | Content                                                    | Published by                       |
| ------------------------ | ---------------------------------------------------------- | ---------------------------------- |
| `/`                      | Landing page: demo accounts, list of pull request previews | every publish (`pages/index.html`) |
| `/demo/`                 | The app, built from `main`                                 | `.github/workflows/static.yml`     |
| `/coverage/`             | e2e coverage of `main`                                     | `static.yml`                       |
| `/pr/<number>/`          | The app, built from the pull request                       | `.github/workflows/pr-preview.yml` |
| `/pr/<number>/coverage/` | e2e coverage of the pull request                           | `pr-preview.yml`                   |
| `/prs.json`              | The list shown on the landing page                         | `pr-preview.yml`                   |

Each pull request gets a comment linking its preview, updated on every push.
Previews are kept when the pull request closes; the list records whether it
was merged or closed. Pull requests from forks are not previewed (their
workflow token cannot write to the repository).

## The in-browser backend

`yarn build:demo` builds the app with `VITE_DEMO=true`. At start-up
(`src/main.tsx`) the app then loads `src/demo/`, which:

- opens a copy of `db/RCO2.sqlite` in memory with
  [sql.js](https://sql.js.org) (SQLite compiled to WebAssembly);
- adds the demo accounts from `src/demo/credentials.ts`;
- installs an axios adapter that answers the app's API calls
  (`src/demo/soulEmulator.ts`): soul-cli's rows API with auth on, and the
  login and password endpoints in `_devExtensions/`.

So the demo runs the production code paths: the same data provider, auth
provider and role permissions (from `_roles_permissions`) as a real server.
Changes last until the page is reloaded. The emulator follows soul-cli
0.12.0 for what RCO uses (it does not emulate OR/NOT filter groups,
aggregates or the batch endpoint); if soul is upgraded, check
`soulEmulator.ts` against it
(`src/demo/soulEmulator.test.ts` covers the behaviour the app relies on).

Demo accounts (all with password `Demo-Vault-2468!`): `demo` (power user),
`demo-user` (user), `demo-viewer` (read only). The password is public: it
appears on the landing page and in preview comments, and must match
`src/demo/credentials.ts` (a unit test checks this).

Run the demo locally:

```bash
yarn build:demo
```

```bash
yarn preview
```

## The gh-pages branch

`scripts/gh-pages/publish.cjs` writes the site to the `gh-pages` branch.
The branch holds a single commit, replaced on each publish, so old previews
do not grow the repository's history. Concurrent publishes are safe: the push
uses `--force-with-lease` and retries from the new tip.

### One-off setup

In the repository's **Settings → Pages**, set **Source** to **Deploy from a
branch**, branch `gh-pages`, folder `/ (root)`. The branch is created by the
first publish (a push to `main`, a manual run of _Publish demo to GitHub
Pages_, or a pull request).

### Removing a preview

Previews are kept indefinitely. To remove one, delete `pr/<number>/` and its
entry in `prs.json` on the `gh-pages` branch.
