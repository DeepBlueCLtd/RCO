import React from 'react'
import {
  SimpleForm,
  TextInput,
  BooleanInput,
  useEditContext
} from 'react-admin'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { decryptPassword } from '../utils/encryption'

const schema = yup.object({
  name: yup.string().required(),
  password: yup.string().max(8).min(4),
  adminRights: yup.boolean()
})

export default function UserForm(): React.ReactElement {
  const defaultValues = {
    name: '',
    password: '',
    adminRights: false
  }
  const { record } = useEditContext()
  return (
    <SimpleForm defaultValues={defaultValues} resolver={yupResolver(schema)}>
      <TextInput source='name' variant='outlined' sx={{ width: '100%' }} />
      <TextInput
        source='password'
        variant='outlined'
        sx={{ width: '100%' }}
        format={(password) => {
          if (password?.length === 88)
            return decryptPassword(password, record.salt)
          else return password !== null ? password : ''
        }}
      />
      <BooleanInput source='adminRights' />
    </SimpleForm>
  )
}
