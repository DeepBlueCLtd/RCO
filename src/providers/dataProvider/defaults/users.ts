const users: User[] = [
  {
    id: 1,
    name: 'ian',
    password: 'admin',
    adminRights: true,
    role: 'rco-power-user',
    createdAt: '',
    createdBy: 2,
    staffNumber: 'd-1',
    departedDate: null
  },
  {
    id: 2,
    name: 'jason',
    // password: 'user',
    adminRights: false,
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
    role: 'rco-user',
    createdAt: '',
    createdBy: 2,
    staffNumber: 'd-4',
    departedDate: null
  }
]

export default users
