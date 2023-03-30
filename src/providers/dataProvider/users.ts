import bcrypt from 'bcryptjs'
const users: User[] = [
  {
    id: 1,
    name: 'jan',
    password: 'admin',
    adminRights: true
  },
  {
    id: 2,
    name: 'jason',
    password: 'user',
    adminRights: false
  }
]

export const encryptUserPassword = async (user: User) => {
  const hashedPassword = await bcrypt.hash(user.password, 10)
  return { ...user, password: hashedPassword }
}

export default users
