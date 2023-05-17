import React from 'react'
import { Create, Edit, Show, type TransformData } from 'react-admin'
import UserForm from './UserForm'
import {
  decryptPassword,
  encryptData,
  generateSalt
} from '../../utils/encryption'
import UserShow from './UserShow'

const UserList = React.lazy(async () => await import('./UserList'))

const transform = (data: any, options: any): TransformData => {
  const salt: string = generateSalt()
  let userPassword
  if (options !== undefined && data.password.length === 88) {
    const { previousData } = options
    userPassword = decryptPassword(previousData.password, previousData.salt)
  } else {
    userPassword = data.password
  }
  const updatedData = {
    ...data,
    salt,
    password: encryptData(`${userPassword}${salt}`)
  }
  return updatedData
}

const UserCreate = (): React.ReactElement => {
  const path: string = '/users'

  return (
    <Create resource='users' transform={transform} redirect={path}>
      <UserForm />
    </Create>
  )
}

const UserEdit = (): React.ReactElement => {
  const path: string = '/users'

  return (
    <Edit resource='users' transform={transform} redirect={path}>
      <UserForm isEdit />
    </Edit>
  )
}

const show = (): React.ReactElement => {
  return (
    <Show>
      <UserShow />
    </Show>
  )
}

const users = {
  create: UserCreate,
  edit: UserEdit,
  list: UserList,
  show
}

export default users
