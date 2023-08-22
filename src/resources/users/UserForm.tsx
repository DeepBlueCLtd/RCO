import React from 'react'
import {
  SimpleForm,
  TextInput,
  BooleanInput,
  useEditContext,
  SelectInput
} from 'react-admin'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { decryptPassword } from '../../utils/encryption'
import EditToolBar from '../../components/EditToolBar'
import { Typography } from '@mui/material'
import { rolesOptions } from '../../utils/options'
import FlexBox from '../../components/FlexBox'

const schema = yup.object({
  name: yup.string().required(),
  password: yup.string().required(),
  adminRights: yup.boolean(),
  role: yup.string().oneOf(rolesOptions.map(({ value }) => value))
})

export default function UserForm({ isEdit }: FormProps): React.ReactElement {
  const defaultValues: Omit<
    User,
    'id' | 'createdAt' | 'createdBy' | 'staffNumber' | 'departedDate'
  > = {
    name: '',
    password: '',
    adminRights: false,
    active: true,
    role: 'rco-user'
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
      <FlexBox>
        <SelectInput
          label='Role'
          source='role'
          optionValue='value'
          optionText='label'
          sx={{ width: '100%', flex: 1 }}
          choices={rolesOptions}
        />
        <TextInput source='staffNumber' label='Staff number' sx={{ flex: 1 }} />
      </FlexBox>
      <FlexBox>
        <BooleanInput source='adminRights' />
        <BooleanInput defaultValue={true} source='active' />
      </FlexBox>
    </SimpleForm>
  )
}
