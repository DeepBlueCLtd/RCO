const users: User[] = [
  {
    id: 1,
    name: 'ian',
    password: 'admin',
    adminRights: true,
    active: true
  },
  {
    id: 2,
    name: 'jason',
    password: 'user',
    adminRights: false,
    active: true
  },
  {
    id: 3,
    name: 'bob',
    password: 'bobWord',
    adminRights: true,
    active: false
  },
  {
    id: 4,
    name: 'arthur',
    password: 'arthurWord',
    adminRights: false,
    active: false
  }
]

export default users
