// Accounts added to the hosted demo's in-browser database. Published on the
// GitHub Pages landing page (pages/index.html), so they are not secret: the
// demo holds only the repository's development data.
export const DEMO_PASSWORD = 'Demo-Vault-2468!'

export const DEMO_USERS = [
  { username: 'demo', name: 'Demo Power User', roleId: 3 },
  { username: 'demo-user', name: 'Demo User', roleId: 2 },
  { username: 'demo-viewer', name: 'Demo Viewer', roleId: 1 }
] as const
