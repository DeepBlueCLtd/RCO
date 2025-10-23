# CLAUDE.md

Developer guide for working with this repository.

## Project Overview

VAL (Vault Asset Log) is a secure asset register application built
with React, React-Admin, and TypeScript. It manages items (media
assets), batches, projects, dispatch, destruction, and vault locations
with role-based access control and comprehensive audit logging.

## Build & Development Commands

### Development

- `yarn dev` - Start development server with Vite (opens at
  <http://localhost:5173>)
- `yarn dev:mock` - Start with mock data (uses LocalForage instead
  of backend)
- `yarn serve:dev` - Run soul-cli backend for development (requires
  `dist` folder to exist first)

### Building

- `yarn build` - Build production application (runs TypeScript
  compiler + Vite build)
- `yarn build:prod` - Same as `yarn build`
- `yarn build:test` - Build test instance with cosmetic changes
  (different color scheme/title)

### Production Server

- `yarn serve` - Serve production build via soul-cli (requires building first)
  - Uses SQLite database at `./db/RCO2.sqlite`
  - Requires `.env` file with `TOKEN_SECRET`
  - Default port: 8000 (configurable via `PORT` env var)
- `yarn serve:large` - Serve with large test database

### Testing

- `yarn test` - Run Jest unit tests
- `yarn e2e` - Run Playwright e2e tests
- `yarn e2e-ui` - Run Playwright tests in UI mode

### Code Quality

- `yarn lint` - Run ESLint with auto-fix (max warnings: 0)
- `yarn format` - Format code with Prettier

### Setup

- `yarn` - Install dependencies
- `yarn prepare` - Install Husky git hooks (runs lint-staged on commit)

### Releases

To create a new release for clients:

```bash
# Create and push a version tag - that's all you need to do
git tag v1.0.2
git push origin v1.0.2
```

The GitHub Actions release workflow (`.github/workflows/release.yml`) automatically:
1. Updates `package.json` version from the tag
2. Runs tests (must pass)
3. Builds production bundle
4. Creates GitHub Release with `dist-v1.0.2.zip` + source code
5. Auto-generates release notes from commits

**Note:** The `version` field in `package.json` is a placeholder - git tags are the source of truth for version numbers.

## Architecture

### Frontend Stack

- **React 18** + **TypeScript** with strict mode enabled
- **React-Admin 4.13.1** - Admin framework providing CRUD
  interfaces, routing, auth
- **Material-UI v5** - UI components and theming
- **Vite** - Build tool and dev server
- **React Hook Form + Yup** - Form validation

### Backend

- **soul-cli** (v0.7.8) - Node.js backend serving SQLite database
  via REST API
- Custom API extensions in `_extensions/` and `_devExtensions/`
- SQLite database at `db/RCO2.sqlite`

### Data Provider Architecture

The data provider (`src/providers/dataProvider/index.ts`) sits
between React-Admin and the backend:

- In production: REST API via soul-cli (`/api/tables`)
- In mock mode: LocalForage (IndexedDB) for offline development
- Wraps base provider with lifecycle callbacks for audit logging
- Custom methods for loan operations (`loanItems`, `returnItems`)
- Configuration data fetched from `_config` table

### Authentication & Authorization

Located in `src/providers/authProvider/`:

- Token-based auth stored encrypted in localStorage
- User roles: `rco-user`, `rco-power-user`, superuser
- Permission system controls read/write/delete per resource
- Session timeout: 1 hour (idle timer in App.tsx)
- Password expiration: 120 days with validation schema
- Audit trail for all login/logout events

### Resource Lifecycle Callbacks

Each resource has lifecycle hooks in `src/providers/dataProvider/resource-callbacks/`:

- `UserLifeCycle.ts` - Password hashing, role management
- `ItemLifeCycle.ts` - Item creation/update audit, vault location tracking
- `BatchLifeCycle.ts` - Batch number generation, child item updates
- `ProjectLifeCycle.ts` - Project audit tracking
- `DispatchLifeCycle.ts` - Dispatch state management
- `DestructionLifeCycle.ts` - Destruction workflow
- `ReferenceItemLifeCycle.ts` - Generic reference data lifecycle

All callbacks use the `trackEvent` audit function to log changes.

### Key Resources & Routes

Defined in `src/App.tsx` and `src/constants.ts`:

- **Items** (`R_RICH_ITEMS`, `R_ALL_ITEMS`) - Media assets with
  complex relationships
- **Batches** (`R_BATCHES`) - Collections of items
- **Projects** (`R_PROJECTS`) - Configurable project/programme
  entities
- **Dispatch** (`R_DISPATCH`) - Item dispatch workflows with
  hastener tracking
- **Destruction** (`R_DESTRUCTION`) - Item destruction workflows
- **Vault Locations** (`R_VAULT_LOCATION`) - Storage locations
- **Users** (`R_USERS`) - User management
- **Audit** (`R_AUDIT`) - Comprehensive audit log
- **Reference Data** - Multiple lookup tables (protective marking,
  cat codes, departments, etc.)

### State Management

- React-Admin built-in state (no Redux)
- LocalForage for mock data persistence
- `NotificationContext` (src/context/) for app-wide notifications
- Custom hooks in `src/hooks/`:
  - `useAudit` - Audit logging helper
  - `useCanAccess` - Permission checking
  - `useLocalStore` - LocalForage wrapper
  - `useRefTable` - Reference data fetching

### Important Type Definitions

All in `src/types.d.ts`:

- Database entities extend `RCOResource` (has `id`) or
  `ResourceWithCreation` (adds `createdAt`, `createdBy`)
- `CustomDataProvider` - Extended data provider interface
- `Permission`, `ResourcePermissions` - Access control types
- All SQL table types: `Item`, `Batch`, `Project`, `Dispatch`,
  `Destruction`, etc.

### Custom Extensions

- `_extensions/api.js` - Production API extensions (serves client, auth endpoints)
- `_devExtensions/` - Development-only extensions (login, password management)
- Extensions integrate with soul-cli to add custom Express routes

### Configuration

- `.env` - Environment variables (`TOKEN_SECRET`,
  `VITE_DATA_VERSION`, `VITE_APP_VERSION`)
- `_config` table in database - Runtime config (project names,
  labels, report settings)
- `src/constants.ts` - Resource names, icons, validation criteria

### Test Configuration

- **Jest** tests in `src/providers/dataProvider/tests/`
- **Playwright** e2e tests in `e2e/tests/`
- Test environment: jsdom
- Mock data generators in `src/utils/generateData.ts`

### Encryption & Security

- `src/utils/encryption.ts` - crypto-js for client-side token encryption
- Password hashing with bcryptjs (server-side in extensions)
- Audit logging for security-related events
- Password validation schema enforces complexity requirements

### ESLint Configuration

- TypeScript strict rules with `@typescript-eslint`
- Single quotes, no semicolons
- Explicit function return types required
- React 18 JSX transform (no need for React import)

### Git Hooks

Husky pre-commit hook runs:

1. ESLint on `.ts`, `.tsx`, `.js`, `.jsx` files
2. Prettier on all source files

## Common Development Patterns

### Adding a New Resource

1. Define types in `src/types.d.ts`
2. Add resource name constant to `src/constants.ts`
3. Create resource folder in `src/resources/[name]/` with Form, List, Show components
4. Export resource config from `src/resources/[name]/index.tsx`
5. Add lifecycle callbacks in `src/providers/dataProvider/resource-callbacks/`
6. Register in `lifecycleCallbacks` array in `src/providers/dataProvider/index.ts`
7. Add route and permissions in `src/App.tsx`

### Running Tests for a Single Test File

```bash
yarn test path/to/test-file.test.ts
```

### Database Changes

- Database schema is managed in SQLite files in `db/` directory
- Increment `VITE_DATA_VERSION` in `.env` to trigger data reload
- Use `loadDefaultData()` in `src/utils/init-data.ts` for seed data

### Working with soul-cli

- Backend API: `http://localhost:8000/api/tables`
- soul-cli serves SQLite via REST with query parameters:
  - `_page`, `_limit` - Pagination
  - `_ordering` - Sort (prefix `-` for DESC)
  - `_filters` - Key:value pairs with operators (`__eq`, `__neq`, `__null`, etc.)
  - `_search` - Full-text search
