import React from 'react'
import { Create, Edit } from 'react-admin'
import UserForm from './UserForm'
import * as constants from '../../constants'

const UserList = React.lazy(async () => await import('./UserList'))
const UserShow = React.lazy(async () => await import('./UserShow'))

const UserCreate = (): React.ReactElement => {
  const path: string = `/${constants.R_USERS}`

  return (
    <Create resource={constants.R_USERS} redirect={path}>
      <UserForm />
    </Create>
  )
}

const UserEdit = (): React.ReactElement => {
  const path: string = `/${constants.R_USERS}`

  return (
    <Edit
      mutationMode={constants.MUTATION_MODE}
      resource={constants.R_USERS}
      redirect={path}>
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
