const bcrypt = require('bcryptjs')
const BS3Database = require('better-sqlite3')
const path = require('path')

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
    mainDb = new BS3Database(path.join(process.cwd(), 'db2/RCO2.sqlite'))
    const { userId } = req.body

    updateUserUpdateBefore(mainDb, userId)
    res.status(201).json({
      message: 'User updateBefore field updated to empty string Successfully!'
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
