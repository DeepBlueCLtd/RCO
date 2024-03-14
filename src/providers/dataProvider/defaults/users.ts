import { DateTime } from 'luxon'

const users: User[] = [
  {
    id: 1,
    name: 'ian',
    hashed_password: 'admin',
    role: 'rco-power-user',
    createdAt: '',
    createdBy: 2,
    username: 'd-1',
    departedDate: DateTime.local().plus({ years: 5 }).toISO(),
    lastUpdatedAt: null,
    lockoutAttempts: 0
  },
  {
    id: 2,
    name: 'jason',
    // password: 'user',
    role: 'rco-user',
    createdAt: '',
    createdBy: 2,
    username: 'd-2',
    departedDate: DateTime.local().plus({ years: 5 }).toISO(),
    lastUpdatedAt: null,
    lockoutAttempts: 0
  },
  {
    id: 3,
    name: 'bob',
    hashed_password: 'bobWord',
    role: 'rco-user',
    createdAt: '',
    createdBy: 2,
    username: 'd-3',
    departedDate: DateTime.local().plus({ years: 5 }).toISO(),
    lastUpdatedAt: null,
    lockoutAttempts: 0
  },
  {
    id: 4,
    name: 'arthur',
    hashed_password: 'arthurWord',
    role: 'rco-user',
    createdAt: '',
    createdBy: 2,
    username: 'd-4',
    departedDate: DateTime.local().plus({ years: 5 }).toISO(),
    lastUpdatedAt: null,
    lockoutAttempts: 0
  }
]

export default users
