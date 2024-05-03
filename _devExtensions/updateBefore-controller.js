const bcrypt = require('bcryptjs')
const BS3Database = require('better-sqlite3')
const path = require('path')

const getUserById = (db, userId) => {
  const query = `
    SELECT createdAt, createdBy, departedDate, id, is_superuser, lastUpdatedAt, lockoutAttempts, name, updateBefore, username
    FROM _users
    WHERE id = ?;
  `
  return db.prepare(query).get(userId)
}

const clearUserUpdateBefore = (db, userId) => {
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
  console.log('In updateBeforeController 1')
  try {
    mainDb = new BS3Database(path.join(process.cwd(), 'db/RCO2.sqlite'))
    const { userId } = req.body.data

    console.log('In updateBeforeController 2')
    clearUserUpdateBefore(mainDb, userId)
    console.log('In updateBeforeController 3')
    const user = getUserById(mainDb, userId)
    console.log('In updateBeforeController 4')
    res.status(201).json({
      userDetails: user
    })
    console.log('In updateBeforeController 5')
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
