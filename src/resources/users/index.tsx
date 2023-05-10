import React from 'react'
import { Create, Edit, type TransformData, useRedirect } from 'react-admin'
import UserForm from './UserForm'
import { encryptData, generateSalt } from '../../utils/encryption'

const UserList = React.lazy(async () => await import('./UserList'))

const transform = (data: any): TransformData => {
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
  const path: string = '/users'
  const redirect = useRedirect()
  const onSuccess = (): void => {
    redirect(path)
  }

  return (
    <Create
      resource='users'
      transform={transform}
      mutationOptions={{
        onSuccess
      }}>
      <UserForm />
    </Create>
  )
}

const UserEdit = (): React.ReactElement => {
  const path: string = '/users'
  const redirect = useRedirect()
  const onSuccess = (): void => {
    redirect(path)
  }

  return (
    <Edit
      resource='users'
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
  list: UserList
}

export default users
