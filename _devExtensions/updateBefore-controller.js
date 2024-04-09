const bcrypt = require('bcryptjs')
const BS3Database = require('better-sqlite3')
const path = require('path')

const getUserById = (db, userId) => {
  const query = `
    SELECT createdAt, createdBy, departedDate, id, is_superuser, lastUpdatedAt, lockoutAttempts, name, role, updateBefore, username
    FROM _users
    WHERE id = ?;
  `
  return db.prepare(query).get(userId)
}

const updateUserUpdateBefore = (db, userId) => {
  const futureTimeString = ''
  const query = `
        UPDATE _users
        SET updateBefore = ?
        WHERE id = ?;
      `
  db.prepare(query).run(futureTimeString, userId)
}

const updateBeforeController = async (req, res) => {
  let mainDb

  try {
    mainDb = new BS3Database(path.join(process.cwd(), 'db/RCO2.sqlite'))
    const { userId } = req.body.data

    updateUserUpdateBefore(mainDb, userId)
    const user = getUserById(mainDb, userId)
    res.status(201).json({
      userDetails: user
    })
  } catch (error) {
    return res.status(400).json({
      message: error.message,
      error: error
    })
  } finally {
    if (mainDb) mainDb.close()
  }
}

module.exports = updateBeforeController
