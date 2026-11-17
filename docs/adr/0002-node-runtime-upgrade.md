# ADR 0002: Node.js runtime upgrade

- **Status:** Proposed
- **Date:** 2026-11-15
- **Deciders:** RCO project leads

## Summary

RCO runs on Node 18, which stopped receiving security fixes on 30
April 2025. **Update, 15 Nov 2026:** the soul-cli blocker is gone.
soul-cli 0.9.3, on npm since 14 Nov 2026, uses `better-sqlite3`
^13.0.3 and `bcrypt` ^6, supports Node 22–26, and is tested in CI on
22, 24 and 26. The remaining work is in RCO: moving from soul-cli
0.7.8 to 0.9.3, which changes how extensions load and adds security
headers (see Upgrade review).

**Decision needed from project leads:**

1. Approve moving RCO to Node 24.
2. Approve upgrading soul-cli from 0.7.8 to 0.9.3, subject to the checks
   in the Upgrade review.
3. Approve the test work before the upgrade (see Test coverage). It is
   most of the effort, so leads should agree its scope.

The upstream change is no longer needed: the soul-cli maintainer has
released the fix. The override is still useful as a short-lived test
step, to change Node and soul-cli one at a time (see Recommendation).

## Current state

Node 18 is pinned in `package.json` (`engines`), in all three GitHub
workflows (compile, static, release) and in the README's build-machine
instructions.

| Node | Status today | End of life |
| --- | --- | --- |
| 26 | Active LTS (since 28 Oct 2026) | 30 Apr 2029 |
| 24 | Maintenance LTS (since 20 Oct 2026) | 30 Apr 2028 |
| 22 | Maintenance LTS | 30 Apr 2027 |
| 20 | End of life | 30 Apr 2026 |
| 18 (RCO today) | End of life | 30 Apr 2025 |

Source: [Node.js release
schedule](https://raw.githubusercontent.com/nodejs/Release/main/schedule.json).
Node 22 is too close to end of life to be worth targeting.

## Findings

The blocker was one native database module inside soul-cli. soul-cli
0.9.3 now ships a supported version, so RCO no longer needs to override
it.

| soul-cli | Released | better-sqlite3 it requires | Node (`engines`) |
| --- | --- | --- | --- |
| 0.9.3 (latest) | Nov 2026 | ^13.0.3 | 22, 24, 26 (CI-tested) |
| 0.8.2 | Oct 2025 | ^8.1.0 | not stated |
| 0.8.1 | Jun 2024 | ^8.1.0 | not stated |
| 0.7.8 (RCO today) | May 2024 | ^8.1.0 | not stated |

Tests run on Node 22 on 30 Oct 2026:

- **Current lockfile:** `yarn install` fails. `better-sqlite3` 8.5.1 has
  no prebuilt binary for Node 22 and fails to compile from source.
- **With `better-sqlite3` forced to 12.11.1:** install succeeds. The
  database opens, soul starts and loads RCO's auth extensions, and the
  tables API correctly returns 401 when not logged in. Login correctly
  rejects bad credentials, and soul's `bcrypt` 5.1.1 hashes correctly.
- **Supported Node versions:** `better-sqlite3` 12.11.1 lists support
  for Node 20 to 26. `bcrypt` 6.0.0 needs Node 18 or later.

**Not yet tested:** the Playwright suite (Jest has since been run: see
Test coverage), full create/update/audit paths, Node 24 and 26, and
air-gapped packaging.

### Upgrade review: soul-cli 0.7.8 → 0.9.3

Reviewed on 15 Nov 2026 by comparing the soul-cli source at both
versions with RCO's code. RCO's routes still load, but helmet's default
headers are the most likely thing to break the production frontend.

| Change in soul-cli | Effect on RCO | Action |
| --- | --- | --- |
| `helmet()` is on by default, adding a Content-Security-Policy and other headers | Applies to the RCO frontend served by the `rcoClient` route in production | Test the `yarn serve` build in a browser; if blocked, ask upstream for a CSP option |
| Extensions: every `.js` file in the folder is loaded, not just `api.js` | Simulated on `_devExtensions`: all 5 routes register, plus about 15 harmless "Skipping" warnings from helper and yup schema exports | Optional: move helpers into a subfolder |
| CORS allows only the `Content-Type` and `Authorization` request headers | Any other custom request headers from the frontend are blocked | Check the frontend's requests |
| Auth cookie is `SameSite=lax` by default (`COOKIE_SAMESITE`) | Fine for same-site use; check client deployment URLs | Set `COOKIE_SAMESITE` if needed |
| WebSocket connections need authentication | Affects RCO only if it uses realtime | Confirm whether RCO uses it |
| Rows/tables: column and table names checked against the live schema | RCO's filter, extend and ordering queries could be rejected | Not covered yet: e2e only tests login. Add integration tests using RCO's real queries |
| Express 4 → Express 5 | `_extensions/api.js` requires `express` without listing it, so it silently gets Express 5 | Add `express` to RCO's dependencies |
| `_users_roles` unique constraint corrected (0.9.1) | Effect on an existing `RCO2.sqlite` unknown | Test the upgrade on a copy of a client database |

RCO also lists `better-sqlite3` ^8.1.0 as its own dependency, which its
extensions use. Bump it to ^13 to match soul-cli.

## Options

Option B has been done upstream: soul-cli 0.9.3 contains the fix. Option
A is no longer needed as a fix, only briefly as a test step. What's left
is a normal dependency upgrade in RCO.

| Option | Status (15 Nov 2026) | What it involves | For | Against |
| --- | --- | --- | --- | --- |
| A. Override in RCO | Test step only | Yarn `resolutions` forces `better-sqlite3` ^12; RCO moves to Node 24 or 26 | Days, not weeks; RCO controls it entirely | Runs soul on a database version it was never tested with; a workaround someone has to remember to remove |
| B. Fix soul-cli upstream | Done: released as 0.9.3 | Bump `better-sqlite3` and `bcrypt`, add `engines`, CI on Node 24 and 26, release | Fixes the root cause; benefits all soul users; no workaround left in RCO | Brings in the 0.8.x–0.9.x changes, now reviewed under Findings |
| C. Stay on Node 18 | Rejected | Nothing | No effort now | Unpatched runtime; likely fails security reviews; the gap keeps growing |

## Risks and open questions

The main risk is now the soul-cli 0.7.8 → 0.9.3 upgrade, not Node
itself.

- **Maintenance:** soul-cli went 16 months between 0.8.1 and 0.8.2.
  Since Aug 2026, though, the maintainer has released 0.9.0–0.9.3, with
  a security hardening pass, CI on Node 22/24/26 and automated npm
  publishing. The risk is lower, but it is still a single maintainer.
- **Who can publish to npm?** Answered: releases publish to npm
  automatically from GitHub releases. The timing is still the
  maintainer's.
- **Version jump:** RCO goes from 0.7.8 to 0.9.3. The changes that
  affect RCO are listed in the Upgrade review. No 0.7.x backport is
  needed.
- **Client deployments:** native modules are built for each OS, so every
  air-gapped client needs a new deployment package, and target servers
  need the new Node installed.
- **Test coverage:** the 30 Oct smoke test used 0.7.8 with an override,
  so it must be repeated on 0.9.3. The full Jest and e2e suites must
  pass on Node 24 before release.
- **Longer term:** RCO's `_devExtensions` already implements most of the
  auth layer. If soul-cli stalls again, forking it or replacing it are
  realistic choices.
- **Owners and dates:** no checklist item has an owner or a target date
  yet.
- **Scope versus urgency:** RCO stays on an unsupported runtime until
  the upgrade ships, and the test work could take months. Agree the
  minimum tests that gate the upgrade (auth integration tests and the
  main workflows), and let the rest follow.
- **Account rules at token issuance:** lockout after failed attempts,
  departed users and the password-update deadline should be enforced
  where soul issues and refreshes tokens. Plan: move them into a small
  RCO plugin once soul's plugin API lands (thevahidal/soul#278, middleware
  before core routes), with integration tests for each rule at both token
  routes. Accepted for now; part of the longer-term work.
- **Rate limiting:** do not enable soul's `-r` flag on soul-cli 0.7.8.
  Its rate-limit settings are not applied, so the library default (5
  requests per minute per IP, on every route) would block normal use.
  Fixed in 0.9.x; revisit after the upgrade, ideally limited to the
  auth routes.

## Test coverage

RCO's automated tests cover 8.4% of lines and 2.8% of branches, so they
can't yet confirm the upgrade. Most auth and JWT paths that talk to the
server are untested. Measured on 15 Nov 2026: Jest, Node 22,
`better-sqlite3` forced to 12 in a scratch copy. All 5 suites (40 tests)
pass.

| Area | Lines covered | Notes |
| --- | --- | --- |
| `_devExtensions/login-controller.js` (lockout, password checks) | 100% | Only fully tested server file |
| `_devExtensions/auth-helper.js` (JWT verification, role checks) | 0% | |
| `editPassword-controller.js`, `updateBefore-controller.js`, `api.js` (password history) | 0% | |
| `authProvider/index.ts` (frontend login, logout, session) | 15% | |
| `authProvider/permissions.ts` (role permissions) | 13% | |
| `dataProvider/index.ts` (all calls to soul) | 7% | |
| `Login.tsx`, `ChangePassword.tsx` | 0% | |
| `App.tsx` | not measured | The coverage tool fails on it ("Spread children are not supported") |

- **No unit test talks to soul.** All of them use mocks, so nothing
  tests getting, refreshing, expiring or revoking a token, or the
  per-role table permissions, against a real server. Soul's own suite
  covers soul's internals, not how RCO uses it.
- **e2e (Playwright):** one spec with 5 login tests. It needs soul
  running separately and isn't run in CI, where only `yarn test` runs.
  Not run for this review.

**Approach:** write integration tests against a real soul-cli first, get
them passing on 0.7.8, then run them on 0.9.3. A test that passes on
0.7.8 and fails on 0.9.3 points straight at a change in soul's
behaviour. That makes the upgrade review checkable, rather than a manual
walk through every logic path.

**Follow-on, after the upgrade:** once e2e covers the main workflows,
use it as the safety net for refactoring the UI code. Move logic out of
the React components into plain functions that unit tests can reach, and
confirm each refactor with e2e. RCO has already started down this road:
PR #1160 pulled operations out into `*-operations.ts` with unit tests.
Three cautions:

- **e2e only protects the paths it exercises.** Measure e2e coverage
  (for example by instrumenting the Vite build) before refactoring a
  component, so its untested branches are known.
- **Keep the refactor separate from the soul-cli and Node upgrade.** If
  both land together, a failing test can't show which change caused it.
- **e2e needs a fixed fixture database and stable selectors**, or flaky
  tests will make the safety net untrustworthy.

## Recommendation

Target Node 24 and upgrade soul-cli to 0.9.3; use the override only as a
short test step. Node 24 is supported until April 2028 and has been an
LTS release for a year. Node 26 became LTS on 28 Oct 2026, so let it
settle.

Revisit the Node version when the tests are ready. Node 24 is already in
maintenance. If the work runs into 2027, Node 26 (supported to April
2029) gives a year more support for the same cost of redeploying to
air-gapped clients.

- [ ] Leads endorse the plan (Node 24 + soul-cli 0.9.3)
- [ ] RCO: add integration tests against a real soul-cli, using RCO's
      extensions and a fixture database. Cover token get, refresh,
      expiry and revoke; cookie settings; table permissions for each of
      the 3 roles; lockout; password change, history and `updateBefore`;
      WebSocket if used
- [ ] RCO: get the integration tests passing on soul-cli 0.7.8 on Node
      18 as a baseline, before upgrading
- [ ] RCO: run the same tests on Node 24 with soul-cli 0.7.8 and the
      `better-sqlite3` override. This changes only Node, so any failure
      is Node's; then upgrade soul-cli as a separate step
- [ ] RCO: extend e2e beyond login to the item, dispatch and destruction
      workflows, and run e2e in CI
- [ ] RCO: measure e2e coverage of the UI code (instrumented build), and
      run e2e against a fixed fixture database
- [ ] RCO: add a coverage threshold to CI
- [ ] RCO: soul-cli → 0.9.3, `better-sqlite3` → ^13, add `express`;
      update `engines`, the CI workflows and the README to Node 24
- [ ] RCO: run the integration, Jest and e2e suites on Node 24 and fix
      any failures
- [ ] RCO: test the production build in a browser for helmet/CSP, CORS
      headers and cookies
- [ ] RCO: test the upgrade on a copy of an existing client database
- [ ] Ops: back up each client database and keep the previous deployment
      package, so any client can be rolled back
- [ ] Ops: plan new deployment packages and a Node 24 install for each
      client server
- [ ] Follow-on, after the upgrade: enforce account rules at token
      issuance via an RCO soul plugin, and consider rate limiting the auth
      routes (soul-cli 0.9.x)
- [ ] Follow-on, after the upgrade: refactor UI logic out of components
      into unit-testable functions, with e2e confirming each step
- [x] soul-cli: dependencies, `engines` and CI updated upstream
- [x] Confirm who can publish soul-cli to npm

---

Working copy: [Claude
Doc](https://claude.ai/artifact/GR43KTmxXHrxbADwn8R3PY)
