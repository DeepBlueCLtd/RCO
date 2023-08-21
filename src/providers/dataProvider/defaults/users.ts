const users: User[] = [
  {
    id: 1,
    name: 'ian',
    password: 'admin',
    adminRights: true,
    active: true,
    role: 'rco-power-user',
    createdAt: '',
    createdBy: 2,
    staffNumber: 'd-1',
    departedDate: null
  },
  {
    id: 2,
    name: 'jason',
    password: 'user',
    adminRights: false,
    active: true,
    role: 'rco-user',
    createdAt: '',
    createdBy: 2,
    staffNumber: 'd-2',
    departedDate: null
  },
  {
    id: 3,
    name: 'bob',
    password: 'bobWord',
    adminRights: true,
    active: false,
    role: 'rco-user',
    createdAt: '',
    createdBy: 2,
    staffNumber: 'd-3',
    departedDate: null
  },
  {
    id: 4,
    name: 'arthur',
    password: 'arthurWord',
    adminRights: false,
    active: false,
    role: 'rco-user',
    createdAt: '',
    createdBy: 2,
    staffNumber: 'd-4',
    departedDate: null
  }
]

export default users
