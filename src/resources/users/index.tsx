import React from 'react'
import { Create, Edit, type TransformData } from 'react-admin'
import UserForm from './UserForm'
import {
  decryptPassword,
  encryptData,
  generateSalt
} from '../../utils/encryption'
import * as constants from '../../constants'

const UserList = React.lazy(async () => await import('./UserList'))
const UserShow = React.lazy(async () => await import('./UserShow'))

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
  const path: string = `/${constants.R_USERS}`

  return (
    <Create resource={constants.R_USERS} transform={transform} redirect={path}>
      <UserForm />
    </Create>
  )
}

const UserEdit = (): React.ReactElement => {
  const path: string = `/${constants.R_USERS}`

  return (
    <Edit resource={constants.R_USERS} transform={transform} redirect={path}>
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
