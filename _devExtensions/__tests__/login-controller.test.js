const bcrypt = require('bcryptjs')
const BS3Database = require('better-sqlite3')
const path = require('path')
const fs = require('fs')
const loginController = require('../login-controller')

// Mock database setup
const TEST_DB_DIR = path.join(__dirname, 'db')
const TEST_DB_PATH = path.join(TEST_DB_DIR, 'RCO2.sqlite')

describe('Login Controller Security Tests', () => {
  let db

  beforeAll(() => {
    // Create db directory if it doesn't exist
    if (!fs.existsSync(TEST_DB_DIR)) {
      fs.mkdirSync(TEST_DB_DIR, { recursive: true })
    }

    // Create test database
    db = new BS3Database(TEST_DB_PATH)

    // Create users table
    db.exec(`
      CREATE TABLE IF NOT EXISTS _users (
        id INTEGER PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        hashed_password TEXT,
        lockoutAttempts INTEGER DEFAULT 0,
        departedDate TEXT,
        updateBefore TEXT,
        createdAt TEXT
      )
    `)
  })

  beforeEach(() => {
    // Clear users before each test
    db.exec('DELETE FROM _users')

    // Mock process.cwd() to return test directory
    jest.spyOn(process, 'cwd').mockReturnValue(__dirname)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  afterAll(() => {
    db.close()
    // Clean up test database and directory
    if (fs.existsSync(TEST_DB_PATH)) {
      fs.unlinkSync(TEST_DB_PATH)
    }
    if (fs.existsSync(TEST_DB_DIR)) {
      fs.rmdirSync(TEST_DB_DIR)
    }
  })

  describe('GHSA-8j4h-hm9v-g9xx: Password Bypass Vulnerability', () => {
    it('should NOT allow login with empty password using username as password', () => {
      // Create user with empty password
      const username = 'testuser'
      db.prepare(
        `
        INSERT INTO _users (username, hashed_password, lockoutAttempts, updateBefore)
        VALUES (?, ?, ?, ?)
      `
      ).run(username, '', 0, new Date(Date.now() + 86400000).toISOString())

      const req = {
        body: {
          username: username,
          password: username // Attempting bypass
        }
      }

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }

      loginController(req, res)

      // Should reject the login attempt
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Invalid password')
        })
      )
    })

    it('should reject login when hashed_password is empty', () => {
      const username = 'emptypassuser'
      db.prepare(
        `
        INSERT INTO _users (username, hashed_password, lockoutAttempts, updateBefore)
        VALUES (?, ?, ?, ?)
      `
      ).run(username, '', 0, new Date(Date.now() + 86400000).toISOString())

      const req = {
        body: {
          username: username,
          password: 'anypassword'
        }
      }

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }

      loginController(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Invalid password'
        })
      )
    })
  })

  describe('Valid Login Scenarios', () => {
    it('should allow login with correct password', () => {
      const username = 'validuser'
      const password = 'ValidP@ssw0rd123'
      const hashedPassword = bcrypt.hashSync(password, 10)

      db.prepare(
        `
        INSERT INTO _users (username, hashed_password, lockoutAttempts, updateBefore)
        VALUES (?, ?, ?, ?)
      `
      ).run(
        username,
        hashedPassword,
        0,
        new Date(Date.now() + 86400000).toISOString()
      )

      const req = {
        body: {
          username: username,
          password: password
        }
      }

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }

      loginController(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            username: username
          })
        })
      )
    })

    it('should reset lockout attempts on successful login', () => {
      const username = 'lockoutuser'
      const password = 'ValidP@ssw0rd123'
      const hashedPassword = bcrypt.hashSync(password, 10)

      db.prepare(
        `
        INSERT INTO _users (username, hashed_password, lockoutAttempts, updateBefore)
        VALUES (?, ?, ?, ?)
      `
      ).run(
        username,
        hashedPassword,
        3,
        new Date(Date.now() + 86400000).toISOString()
      )

      const req = {
        body: {
          username: username,
          password: password
        }
      }

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }

      loginController(req, res)

      expect(res.status).toHaveBeenCalledWith(200)

      // Check lockout attempts reset to 0
      const user = db
        .prepare('SELECT lockoutAttempts FROM _users WHERE username = ?')
        .get(username)
      expect(user.lockoutAttempts).toBe(0)
    })
  })

  describe('Failed Login Scenarios', () => {
    it('should increment lockout attempts on wrong password', () => {
      const username = 'testuser'
      const correctPassword = 'ValidP@ssw0rd123'
      const hashedPassword = bcrypt.hashSync(correctPassword, 10)

      db.prepare(
        `
        INSERT INTO _users (username, hashed_password, lockoutAttempts, updateBefore)
        VALUES (?, ?, ?, ?)
      `
      ).run(
        username,
        hashedPassword,
        0,
        new Date(Date.now() + 86400000).toISOString()
      )

      const req = {
        body: {
          username: username,
          password: 'WrongPassword'
        }
      }

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }

      loginController(req, res)

      expect(res.status).toHaveBeenCalledWith(400)

      // Check lockout attempts incremented
      const user = db
        .prepare('SELECT lockoutAttempts FROM _users WHERE username = ?')
        .get(username)
      expect(user.lockoutAttempts).toBe(1)
    })

    it('should block login after 5 failed attempts', () => {
      const username = 'lockeduser'
      const password = 'ValidP@ssw0rd123'
      const hashedPassword = bcrypt.hashSync(password, 10)

      db.prepare(
        `
        INSERT INTO _users (username, hashed_password, lockoutAttempts, updateBefore)
        VALUES (?, ?, ?, ?)
      `
      ).run(
        username,
        hashedPassword,
        5,
        new Date(Date.now() + 86400000).toISOString()
      )

      const req = {
        body: {
          username: username,
          password: password
        }
      }

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }

      loginController(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Your account is locked')
        })
      )
    })

    it('should reject login for non-existent user', () => {
      const req = {
        body: {
          username: 'nonexistent',
          password: 'anypassword'
        }
      }

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }

      loginController(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'User not found'
        })
      )
    })

    it('should reject login for departed users', () => {
      const username = 'departeduser'
      const password = 'ValidP@ssw0rd123'
      const hashedPassword = bcrypt.hashSync(password, 10)
      const pastDate = new Date(Date.now() - 86400000).toISOString() // Yesterday

      db.prepare(
        `
        INSERT INTO _users (username, hashed_password, lockoutAttempts, departedDate, updateBefore)
        VALUES (?, ?, ?, ?, ?)
      `
      ).run(
        username,
        hashedPassword,
        0,
        pastDate,
        new Date(Date.now() + 86400000).toISOString()
      )

      const req = {
        body: {
          username: username,
          password: password
        }
      }

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }

      loginController(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'User has departed organisation'
        })
      )
    })

    it('should reject login when password update is overdue', () => {
      const username = 'expiredpwduser'
      const password = 'ValidP@ssw0rd123'
      const hashedPassword = bcrypt.hashSync(password, 10)
      const pastDate = new Date(Date.now() - 86400000).toISOString() // Yesterday

      db.prepare(
        `
        INSERT INTO _users (username, hashed_password, lockoutAttempts, updateBefore)
        VALUES (?, ?, ?, ?)
      `
      ).run(username, hashedPassword, 0, pastDate)

      const req = {
        body: {
          username: username,
          password: password
        }
      }

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }

      loginController(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('not updated the password')
        })
      )
    })
  })

  describe('Input Validation', () => {
    it('should reject login without password', () => {
      const req = {
        body: {
          username: 'testuser'
        }
      }

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }

      loginController(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('password and username is required')
        })
      )
    })

    it('should reject login without username', () => {
      const req = {
        body: {
          password: 'somepassword'
        }
      }

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }

      loginController(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('password and username is required')
        })
      )
    })
  })
})
