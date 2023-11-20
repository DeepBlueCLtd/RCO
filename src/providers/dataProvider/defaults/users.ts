import { DateTime } from 'luxon'

const users: User[] = [
  {
    id: 1,
    name: 'ian',
    password: 'admin',
    role: 'rco-power-user',
    createdAt: '',
    createdBy: 2,
    staffNumber: 'd-1',
    departedDate: DateTime.local().plus({ years: 5 }).toISO(),
    lastUpdatedAt: null
  },
  {
    id: 2,
    name: 'jason',
    // password: 'user',
    role: 'rco-user',
    createdAt: '',
    createdBy: 2,
    staffNumber: 'd-2',
    departedDate: DateTime.local().plus({ years: 5 }).toISO(),
    lastUpdatedAt: null
  },
  {
    id: 3,
    name: 'bob',
    password: 'bobWord',
    role: 'rco-user',
    createdAt: '',
    createdBy: 2,
    staffNumber: 'd-3',
    departedDate: DateTime.local().plus({ years: 5 }).toISO(),
    lastUpdatedAt: null
  },
  {
    id: 4,
    name: 'arthur',
    password: 'arthurWord',
    role: 'rco-user',
    createdAt: '',
    createdBy: 2,
    staffNumber: 'd-4',
    departedDate: DateTime.local().plus({ years: 5 }).toISO(),
    lastUpdatedAt: null
  }
]

export default users
