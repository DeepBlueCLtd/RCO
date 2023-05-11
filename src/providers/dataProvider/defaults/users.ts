const users: User[] = [
  {
    id: 1,
    name: 'ian',
    password: 'admin',
    adminRights: true,
    active: true,
    roles: ['rco-power-user']
  },
  {
    id: 2,
    name: 'jason',
    password: 'user',
    adminRights: false,
    active: true,
    roles: ['rco-power-user']
  },
  {
    id: 3,
    name: 'bob',
    password: 'bobWord',
    adminRights: true,
    active: false,
    roles: ['rco-user']
  },
  {
    id: 4,
    name: 'arthur',
    password: 'arthurWord',
    adminRights: false,
    active: false,
    roles: ['rco-user']
  }
]

export default users
