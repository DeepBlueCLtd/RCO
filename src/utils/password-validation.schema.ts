import * as yup from 'yup'

const commonPatterns = [
  'password',
  '123123123',
  'qwerty123',
  '1q2w3e',
  'password1',
  'qwertyuiop',
  'starwars',
  'iloveyou',
  'zaq12wsx',
  'asdfghjkl',
  '!@#$%^&*',
  'welcome',
  'access',
  'monkey',
  'fuck',
  'bailey',
  'photoshop',
  'sunshine',
  'master',
  'lovely',
  'mustang',
  'trustno1',
  'zaq1zaq1',
  'football',
  'letmein',
  'dragon',
  'baseball',
  'adobe123',
  'princess',
  '654321',
  'admin',
  '09876zxcvb',
  'passw0rd',
  'charlie',
  'donald',
  'whatever',
  'solo',
  'loveme',
  'azerty',
  'ninja',
  'qazwsx',
  'michael',
  'superman',
  'jesus',
  'hottie',
  'freedom',
  'batman',
  'spiderman',
  '3rjs1la7qe',
  'zxcvbnm',
  'matrix',
  '6969',
  'pussy',
  'alien',
  'yomama',
  'killer',
  'shadow',
  'chelsea',
  'biteme',
  'matthew',
  'yankees',
  'thunder',
  'taylor',
  'maggie',
  'andrew',
  'soccer',
  'tigger',
  'jennifer',
  'hockey',
  '131313',
  'ranger',
  'daniel',
  'klaster',
  '121212',
  '000',
  '1qaz2wsx',
  'cheese',
  'joshua',
  'summer',
  '2000',
  'hack',
  'nasa'
]

const common = yup
  .string()
  .required('Password is required')
  .min(10, 'Password must be at least 10 characters long')
  .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
  .matches(/[0-9]/, 'Password must contain at least one numeric digit')
  .matches(
    /[!@#$%^&*(),.?":{}|<>]/,
    'Special character required - !@#$%^&*(),.?":{}|<>'
  )
  .test(
    'no-common-patterns',
    'Password cannot match common patterns',
    (value) =>
      !commonPatterns.some((pattern) =>
        value.toLowerCase().includes(pattern.toLowerCase())
      )
  )
  .test(
    'no-consecutive-chars',
    'Password cannot include 4 consecutive characters',
    (value) => {
      for (let i = 0; i < value.length - 3; i++) {
        if (
          (value.charCodeAt(i) === value.charCodeAt(i + 1) - 1 &&
            value.charCodeAt(i) === value.charCodeAt(i + 2) - 2 &&
            value.charCodeAt(i) === value.charCodeAt(i + 3) - 3) ||
          (value.charCodeAt(i) === value.charCodeAt(i + 1) + 1 &&
            value.charCodeAt(i) === value.charCodeAt(i + 2) + 2 &&
            value.charCodeAt(i) === value.charCodeAt(i + 3) + 3)
        ) {
          return false
        }
      }
      return true
    }
  )

const userFormSchemaWithoutCommon = yup
  .string()
  .required()
  .test(
    'no-name-in-password',
    'Password cannot include name or staff number',
    function (value) {
      const name = this.parent.name
      const staffId = this.parent.username
      if (
        value.toLowerCase().includes(name.toLowerCase()) ||
        value.toLowerCase().includes(staffId.toLowerCase())
      ) {
        return false
      }

      return true
    }
  )

export const passwordValidationSchema = common.concat(
  userFormSchemaWithoutCommon
)

const resetPasswordWithoutCommon = yup
  .string()
  .required()
  .test('equal-to-password', 'Passwords do not match', function (value) {
    const newPassword = this.parent.newPassword
    if (value === newPassword) return true
    else return false
  })

export const resetPasswordValidationSchema = common.concat(
  resetPasswordWithoutCommon
)
