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

// One message for "no such user" and "wrong password", so a failed login
// does not reveal which usernames exist.
const INVALID_LOGIN = 'Invalid username or password'

// Compared against when the username is unknown, so that response takes
// about as long as a wrong password for a real user.
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 10)

const validateUser = (username, hashed_password, db) => {
  const query = `SELECT * FROM _users WHERE username=?`
  const user = db.prepare(query).get(username)

  if (!user) {
    bcrypt.compareSync(hashed_password, DUMMY_HASH)
    throw new Error(INVALID_LOGIN)
  }

  // Checked before the password, so a locked account cannot be used to
  // confirm guesses.
  if (user.lockoutAttempts >= 5)
    throw new Error('Your account is locked. Please contact your administrator')

  const ishashed_passwordCorrect = bcrypt.compareSync(
    hashed_password,
    user.hashed_password
  )

  if (!ishashed_passwordCorrect) {
    updateLockoutAttempts(db, user.lockoutAttempts + 1, username)
    throw new Error(INVALID_LOGIN)
  }

  // Account status is only revealed to someone who knows the password.
  const hasUserDeparted =
    user.departedDate !== undefined &&
    user.departedDate !== null &&
    checkIfDateHasPassed(user.departedDate)

  if (hasUserDeparted) throw new Error('User has departed organisation')

  const currentTime = new Date().toISOString()
  const hasUserNotUpdated = user.updateBefore
  if (currentTime > hasUserNotUpdated && hasUserNotUpdated) {
    throw new Error(
      'You have not updated the password. Please contact your administrator'
    )
  }

  updateLockoutAttempts(db, 0, username)
  delete user.hashed_password
  return user
}

const loginController = (req, res) => {
  let db

  try {
    const { password, username } = req.body

    if (!password || !username)
      throw new Error('password and username is required')

    db = new BS3Database(path.join(process.cwd(), 'db/RCO2.sqlite'))
    const user = validateUser(username, password, db)

    res.status(200).json({ data: user })
  } catch (error) {
    res.status(400).json({
      message: error.message,
      error: error
    })
  }
}

module.exports = loginController
