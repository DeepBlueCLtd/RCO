const bcrypt = require('bcryptjs')
const BS3Database = require('better-sqlite3')
const { DateTime } = require('luxon')
const path = require('path')

const checkIfDateHasPassed = (dateString) => {
  const jsDate = new Date(dateString)
  const dateTime = DateTime.fromJSDate(jsDate)
  const currentDateTime = DateTime.local()
  return currentDateTime > dateTime
}

const updateLockoutAttempts = (db, val, username) => {
  const updateLockoutAttemptsQuery = `UPDATE _users SET lockoutAttempts = ? where username = ?`
  db.prepare(updateLockoutAttemptsQuery).run(val, username)
}

const validateUser = (username, hashed_password, db) => {
  const query = `SELECT * FROM _users WHERE username=?`
  const user = db.prepare(query).get(username)

  if (!user) {
    throw new Error('User not found')
  }

  if (user.lockoutAttempts >= 5)
    throw new Error(
      'Your account is locked. Please contact your administrator [' +
        user.lockoutAttempts +
        ']'
    )

  const hasUserDeparted =
    user.departedDate !== undefined &&
    user.departedDate !== null &&
    checkIfDateHasPassed(user.departedDate)

  if (hasUserDeparted) throw new Error('User has departed organisation')

  if (user.hashed_password === '' && hashed_password === username) {
    updateLockoutAttempts(db, 0, username)
    return user
  }

  const ishashed_passwordCorrect = bcrypt.compareSync(
    hashed_password,
    user.hashed_password
  )

  if (!ishashed_passwordCorrect) {
    updateLockoutAttempts(db, user.lockoutAttempts + 1, username)
    throw new Error('Invalid hashed_password')
  }

  updateLockoutAttempts(db, 0, username)

  return user
}

const loginController = (req, res) => {
  let db

  try {
    const { hashed_password, username } = req.body

    if (!hashed_password || !username)
      throw new Error('hashed_password and username is required')

    db = new BS3Database(path.join(process.cwd(), 'db/RCO2.sqlite'))
    const user = validateUser(username, hashed_password, db)

    res.status(200).json({ data: user })
  } catch (error) {
    res.status(400).json({
      message: error.message,
      error: error
    })
  }
}

module.exports = loginController
