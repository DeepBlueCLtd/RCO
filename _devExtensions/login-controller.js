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

const updateLockoutAttempts = (db, val, staffNumber) => {
  const updateLockoutAttemptsQuery = `UPDATE user SET lockoutAttempts = ? where staffNumber = ?`
  db.prepare(updateLockoutAttemptsQuery).run(val, staffNumber)
}

const validateUser = (staffNumber, password, db) => {
  const query = `SELECT * FROM user WHERE staffNumber=?`
  const user = db.prepare(query).get(staffNumber)

  if (!user) {
    throw new Error('User not found')
  }

  if (user.lockoutAttempts >= 5)
    throw new Error('Your account is locked. Please contact your administrator')

  const hasUserDeparted =
    user.departedDate !== undefined &&
    user.departedDate !== null &&
    checkIfDateHasPassed(user.departedDate)

  if (hasUserDeparted) throw new Error('User has departed organisation')

  if (user.password === '' && password === staffNumber) {
    updateLockoutAttempts(db, 0, staffNumber)
    return user
  }

  const isPasswordCorrect = bcrypt.compareSync(password, user.password)

  if (!isPasswordCorrect) {
    updateLockoutAttempts(db, user.lockoutAttempts + 1, staffNumber)
    throw new Error('Invalid password')
  }

  updateLockoutAttempts(db, 0, staffNumber)

  return user
}

const loginController = (req, res) => {
  let db

  try {
    const { password, staffNumber } = req.body

    if (!password || !staffNumber)
      throw new Error('Password and staffNumber is required')

    db = new BS3Database(path.join(process.cwd(), 'db/RCO2.sqlite'))

    const user = validateUser(staffNumber, password, db)

    res.status(200).json({ data: user })
  } catch (error) {
    res.status(400).json({
      message: error.message,
      error: error
    })
  }
}

module.exports = loginController
