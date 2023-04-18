import React from 'react'
import { Create, Edit, useRedirect } from 'react-admin'
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
  const path: string = '/reference-data/users'
  const redirect = useRedirect()
  const onSuccess = () => {
    redirect(path)
  }

  return (
    <Create
      transform={transform}
      mutationOptions={{
        onSuccess
      }}>
      <UserForm />
    </Create>
  )
}

const UserEdit = (): React.ReactElement => {
  const path: string = '/reference-data/users'
  const redirect = useRedirect()
  const onSuccess = () => {
    redirect(path)
  }

  return (
    <Edit
      transform={transform}
      mutationOptions={{
        onSuccess
      }}>
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
