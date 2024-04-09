import { DateTime } from 'luxon'

const users: _Users[] = [
  {
    id: 1,
    name: 'ian',
    hashed_password: 'admin',
    role: 'rco-power-user',
    is_superuser: false,
    createdAt: '',
    createdBy: 2,
    username: 'd-1',
    departedDate: DateTime.local().plus({ years: 5 }).toISO(),
    lastUpdatedAt: null,
    lockoutAttempts: 0,
    updateBefore: ''
  },
  {
    id: 2,
    name: 'jason',
    // hashed_password: 'user',
    role: 'rco-user',
    is_superuser: false,
    createdAt: '',
    createdBy: 2,
    username: 'd-2',
    departedDate: DateTime.local().plus({ years: 5 }).toISO(),
    lastUpdatedAt: null,
    lockoutAttempts: 0,
    updateBefore: ''
  },
  {
    id: 3,
    name: 'bob',
    hashed_password: 'bobWord',
    role: 'rco-user',
    is_superuser: false,
    createdAt: '',
    createdBy: 2,
    username: 'd-3',
    departedDate: DateTime.local().plus({ years: 5 }).toISO(),
    lastUpdatedAt: null,
    lockoutAttempts: 0,
    updateBefore: ''
  },
  {
    id: 4,
    name: 'arthur',
    hashed_password: 'arthurWord',
    role: 'rco-user',
    is_superuser: false,
    createdAt: '',
    createdBy: 2,
    username: 'd-4',
    departedDate: DateTime.local().plus({ years: 5 }).toISO(),
    lastUpdatedAt: null,
    lockoutAttempts: 0,
    updateBefore: ''
  }
]

export default users
