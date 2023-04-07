import React from 'react'
import { Create, Edit } from 'react-admin'
import UserForm from './UserForm'
import { encryptData, generateSalt } from '../../utils/encryption'

const UserList = React.lazy(async () => await import('./UserList'))
const UserShow = React.lazy(async () => await import('./UserShow'))

const transform = (data: any) => {
  const salt: string = generateSalt()
  const userPassword: string = data.password
  const updatedData = {
    ...data,
    salt,
    password: encryptData(`${userPassword}${salt}`)
  }
  return updatedData
}

const UserCreate = (): React.ReactElement => {
  return (
    <Create transform={transform}>
      <UserForm />
    </Create>
  )
}

const UserEdit = (): React.ReactElement => {
  return (
    <Edit transform={transform}>
      <UserForm isEdit />
    </Edit>
  )
}

const users = {
  create: UserCreate,
  edit: UserEdit,
  list: UserList,
  show: UserShow
}

export default users
