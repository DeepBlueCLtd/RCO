import bcrypt from 'bcryptjs'
import { type Database } from 'sql.js'
import { DEMO_PASSWORD, DEMO_USERS } from './credentials'

/** Add the demo accounts (see credentials.ts) to the database. */
let hash: string | undefined

export const seedDemoUsers = (db: Database): void => {
  hash = hash ?? bcrypt.hashSync(DEMO_PASSWORD, 10)
  const now = new Date().toISOString()
  // as the app does on user creation (UserLifeCycle): departs in 10 years
  const departs = new Date(
    Date.now() + 10 * 365 * 24 * 3600 * 1000
  ).toISOString()
  for (const user of DEMO_USERS) {
    db.run('DELETE FROM _users WHERE username = ?', [user.username])
    db.run(
      `INSERT INTO _users (name, hashed_password, username, is_superuser,
         departedDate, lastUpdatedAt, createdAt, createdBy, lockoutAttempts)
       VALUES (?, ?, ?, 0, ?, ?, ?, 1, 0)`,
      [user.name, hash, user.username, departs, now, now]
    )
    db.run(
      `INSERT INTO _users_roles (user_id, role_id, createdAt, updatedAt)
       VALUES (last_insert_rowid(), ?, ?, ?)`,
      [user.roleId, now, now]
    )
  }
}
