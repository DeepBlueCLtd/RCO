const users: User[] = [
  {
    id: 1,
    name: 'ian',
    password: 'admin',
    adminRights: true,
    active: true,
    roles: ['rco-power-user'],
    createdAt: '',
    createdBy: 2,
    staffNumber: 'd-1'
  },
  {
    id: 2,
    name: 'jason',
    password: 'user',
    adminRights: false,
    active: true,
    roles: ['rco-user'],
    createdAt: '',
    createdBy: 2,
    staffNumber: 'd-2'
  },
  {
    id: 3,
    name: 'bob',
    password: 'bobWord',
    adminRights: true,
    active: false,
    roles: ['rco-user'],
    createdAt: '',
    createdBy: 2,
    staffNumber: 'd-3'
  },
  {
    id: 4,
    name: 'arthur',
    password: 'arthurWord',
    adminRights: false,
    active: false,
    roles: ['rco-user'],
    createdAt: '',
    createdBy: 2,
    staffNumber: 'd-4'
  }
]

export default users
