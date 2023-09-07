import React from 'react'
import { Create, Edit, type TransformData } from 'react-admin'
import UserForm from './UserForm'

import * as constants from '../../constants'
import bcrypt from 'bcryptjs'

const UserList = React.lazy(async () => await import('./UserList'))
const UserShow = React.lazy(async () => await import('./UserShow'))

const transform = (data: any): TransformData => {
  const updatedData = {
    ...data,
    password: bcrypt.hashSync(data.password, data.name)
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
