import React from 'react'
import { SimpleForm, TextInput, useEditContext, SelectInput } from 'react-admin'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import EditToolBar from '../../components/EditToolBar'
import { Typography } from '@mui/material'
import { rolesOptions } from '../../utils/options'
import FlexBox from '../../components/FlexBox'

const schema = yup.object({
  name: yup.string().required(),
  role: yup
    .string()
    .transform((val) => {
      if (!val) return null
      else return rolesOptions.find((role) => role.value === val)?.value
    })
    .oneOf(rolesOptions.map(({ value }) => value))
    .nullable()
    .optional()
})

export default function UserForm({ isEdit }: FormProps): React.ReactElement {
  const defaultValues: Omit<
    User,
    | 'id'
    | 'createdAt'
    | 'createdBy'
    | 'staffNumber'
    | 'departedDate'
    | 'lastUpdatedAt'
    | 'lockoutAttempts'
  > = {
    name: '',
    password: '',
    role: 'rco-user'
  }
  const { record } = useEditContext()
  const pageTitle = isEdit !== undefined ? 'Edit User' : 'Add new User'

  return (
    <SimpleForm
      record={{ ...record, password: '' }}
      toolbar={<EditToolBar />}
      defaultValues={defaultValues}
      resolver={yupResolver(schema)}>
      <Typography variant='h5' fontWeight='bold'>
        {pageTitle}
      </Typography>
      <TextInput source='name' variant='outlined' sx={{ width: '100%' }} />
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
    </SimpleForm>
  )
}
