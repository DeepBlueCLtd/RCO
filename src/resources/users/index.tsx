import React from 'react'
import {
  Create,
  Edit,
  EditButton,
  Show,
  TopToolbar,
  type TransformData
} from 'react-admin'
import UserForm from './UserForm'
import {
  decryptPassword,
  encryptData,
  generateSalt
} from '../../utils/encryption'
import UserShow from './UserShow'
import useCanAccess from '../../hooks/useCanAccess'
import { R_USERS } from '../../constants'

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

const UserShowActions = (): React.ReactElement => {
  return (
    <TopToolbar>
      <EditButton />
    </TopToolbar>
  )
}

const ShowUser = (): React.ReactElement => {
  const { hasAccess } = useCanAccess()
  const hasDeleteAccess = hasAccess(R_USERS, { delete: true })

  return (
    <Show actions={hasDeleteAccess && <UserShowActions />}>
      <UserShow />
    </Show>
  )
}

const users = {
  create: UserCreate,
  edit: UserEdit,
  list: UserList,
  show: ShowUser
}

export default users
