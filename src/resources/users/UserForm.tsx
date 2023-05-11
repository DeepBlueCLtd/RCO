import React from 'react'
import {
  SimpleForm,
  TextInput,
  BooleanInput,
  useEditContext
} from 'react-admin'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { decryptPassword } from '../../utils/encryption'
import EditToolBar from '../../components/EditToolBar'
import { Typography } from '@mui/material'

const schema = yup.object({
  name: yup.string().required(),
  password: yup.string().max(8).min(4),
  adminRights: yup.boolean()
})

export default function UserForm({ isEdit }: FormProps): React.ReactElement {
  const defaultValues: Omit<User, 'id'> = {
    name: '',
    password: '',
    adminRights: false,
    active: true
  }
  const { record } = useEditContext()
  const pageTitle = isEdit !== undefined ? 'Edit User' : 'Add new User'

  return (
    <SimpleForm
      toolbar={<EditToolBar />}
      defaultValues={defaultValues}
      resolver={yupResolver(schema)}>
      <Typography variant='h5' fontWeight='bold'>
        {pageTitle}
      </Typography>
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
      <BooleanInput source='active' />
    </SimpleForm>
  )
}
