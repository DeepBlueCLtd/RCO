# ADR 0001: Backend platform for RCO / VAL

- **Status:** Proposed
- **Date:** 2026-11-15
- **Deciders:** RCO maintainers

## Context

RCO uses [soul-cli](https://github.com/thevahidal/soul) (v0.7.8 when
written; v0.12.0 since 20 Nov 2026) as its
backend: a Node process exposing `db/RCO2.sqlite` over REST. Soul was
chosen before alternatives such as PocketBase or Supabase were known to
the team. This ADR records whether an architectural refactor should
replace it.

### What RCO relies on today

| Capability | How it is provided |
|---|---|
| REST over SQLite | Soul core (`/api/tables/...`) |
| Login, access/refresh tokens | Soul `--a`, `--atet 15m`, `--rtet 60m` (sponsored) |
| Role-based table permissions | Soul `_roles`, `_roles_permissions`, `_users_roles` (enforced server-side) |
| Password policy: complexity, expiry, lockout, history | `_devExtensions/` (login, editPassword, updateBefore controllers) |
| Serving the built SPA | `_extensions/api.js` via Soul extensions (sponsored) |
| Audit trail | **Client-side**: `src/utils/audit.ts` `trackEvent`, called from lifecycle callbacks |

### Constraints

- Deployed to **air-gapped** client servers as a zip (no Docker
  registry, no internet at runtime).
- Small user base, single server; SQLite is adequate.
- Long-lived installs: upgrade churn is costly.
- Existing client databases must migrate with minimal risk.

### Problem found during review

Audit records are built and written by the browser. `user`, `dateTime`
and `ip` are set client-side, and any authenticated caller hitting
`/api/tables` directly bypasses auditing entirely. For a secure asset
register this is the main architectural weakness — and it is
independent of which backend is chosen.

## Options considered

| Option | Fit with existing schema | Auth / RBAC | Password policy | SPA hosting | Server-side audit | Air-gap deploy | Key risks |
|---|---|---|---|---|---|---|---|
| **1. Stay on Soul** | Exact | Have it | Have it | Have it | Add via extension or SQLite triggers | Simple (Node zip) | Small project; maintenance depends on few people (mitigated by sponsorship) |
| **2. Directus** | Introspects existing schema | Rich RBAC (collection/field/row) | Regex policy + lockout built in; expiry needs extension | Extension or reverse proxy | Built-in activity & revisions | Node zip, large `node_modules` | BSL licence (verify); heavier; RBAC remodel |
| **3. Custom backend** (Fastify + better-sqlite3) | Exact | Build | Port `_devExtensions` ~as-is | Trivial | Easy | Simple (Node zip) | We own everything, incl. RBAC currently free from Soul |
| **4. PocketBase** | Requires data migration (string IDs, own conventions) | Collection rules, no role tables | Rewrite as hooks | Built in (`pb_public`) | Hooks | Single binary (best) | Pre-1.0 breaking changes; ID remap of all FKs |
| 5. TrailBase | Migration likely | Basic | Build | Built in | Build | Single binary | Very young project |
| 6. Supabase (self-hosted) | Port to Postgres | GoTrue + RLS | Partial | Needs nginx | Triggers | ~10 Docker services | Disproportionate ops burden air-gapped |

Ruled out without detailed analysis: PostgREST / Hasura (Postgres, no
hosting/auth), Strapi (owns schema), Appwrite / NocoDB (Docker-heavy),
Datasette (read-mostly), json-server (no auth).

## Decision (proposed)

**Stay on Soul** and close the audit gap by moving audit writes
server-side (Soul extension and/or SQLite triggers), so that `user`,
timestamp and IP are derived from the authenticated request, not the
client.

Revisit migration only if a concrete trigger occurs (see below). If so,
evaluate **Directus** and a **custom backend** by a time-boxed spike
(2–3 days each) implementing one resource (Items + audit) against a
copy of `RCO2.sqlite`.

## Rationale

- Soul already meets every functional need, much of it via capabilities
  we sponsored; migrating discards that investment.
- No alternative removes work: each requires re-implementing RBAC,
  password policy or data migration.
- The real weakness (client-side audit) is fixable on Soul at far lower
  cost than a platform change.

## Consequences

**Positive**
- No data migration or client-side rewrite.
- Deployment model unchanged.
- Audit becomes tamper-resistant.

**Negative**
- Continued dependency on a small upstream project.
- Server-side audit logic splits between Soul extension/triggers and
  existing client callbacks during transition; the client calls must be
  removed or made advisory to avoid double entries.

## Triggers to revisit

- Soul upstream becomes unmaintained or a security issue goes unfixed.
- A required capability Soul cannot reasonably add (e.g. field/row-level
  permissions, multi-server).
- Accreditation demands controls Soul cannot evidence.

## Open questions

1. Triggers vs extension for audit: triggers cannot see the
   authenticated user unless it is written into the row; an extension
   wrapping writes can. Which is preferred?
2. Directus BSL terms — acceptable for us and for client deployments?
3. Current Soul maintenance status and our sponsorship arrangement.

_Note: alternative assessments are from general knowledge, not
verified against current releases; confirm versions and licences before
any spike._
