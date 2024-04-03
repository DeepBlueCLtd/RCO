const bcrypt = require('bcryptjs')
const BS3Database = require('better-sqlite3')
const path = require('path')
const passwordValidationSchema = require('./password-validation.schema')

const updateUserPassword = (db, userId, newPassword) => {
  const hashedPassword = bcrypt.hashSync(newPassword)
  console.log(hashedPassword)
  const query = `
        UPDATE _users
        SET hashed_password = ?, lastUpdatedAt = ? 
        WHERE id = ?;
      `
  db.prepare(query).run(hashedPassword, new Date().toISOString(), userId)
}

const editPasswordController = async (req, res) => {
  let mainDb

  try {
    mainDb = new BS3Database(path.join(process.cwd(), 'db/RCO2.sqlite'))
    const { fields: queryFields } = req.body
    queryFields.createdAt = new Date().toISOString()
    const { userId, newPassword } = queryFields

    await passwordValidationSchema.validate(newPassword)

    queryFields.newPassword = bcrypt.hashSync(newPassword)

    const fields = Object.fromEntries(
      Object.entries(queryFields).filter(([_, value]) => value !== null)
    )
    const fieldsString = Object.keys(fields).join(', ')
    const valuesString = Object.values(fields)
      .map((value) => {
        if (typeof value === 'string') {
          return `'${value}'`
        }
        return value
      })
      .join(', ')

    let values = `(${fieldsString}) VALUES (${valuesString})`
    if (valuesString === '') {
      values = 'DEFAULT VALUES'
    }

    updateUserPassword(mainDb, userId, newPassword)
    res.status(201).json({
      message: 'User Password updated Successfully.!'
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

module.exports = editPasswordController
