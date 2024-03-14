import React from 'react'
import {
  SimpleForm,
  TextInput,
  useEditContext,
  SelectInput,
  DateTimeInput
} from 'react-admin'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import EditToolBar from '../../components/EditToolBar'
import { Typography } from '@mui/material'
import { rolesOptions } from '../../utils/options'
import FlexBox from '../../components/FlexBox'
import { DateTime } from 'luxon'
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
  const valueWithTenYears = DateTime.now()
    .plus({ years: 10 })
    .toJSDate()
    .toISOString()
  const defaultValues: Omit<
    _Users,
    | 'id'
    | 'createdAt'
    | 'createdBy'
    | 'username'
    | 'lastUpdatedAt'
    | 'lockoutAttempts'
  > = {
    name: '',
    hashed_password: '',
    role: 'rco-user',
    departedDate: valueWithTenYears
  }
  const { record } = useEditContext()
  const pageTitle = isEdit !== undefined ? 'Edit User' : 'Add new User'

  return (
    <SimpleForm
      record={{ ...record }}
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
        <TextInput source='username' label='Username' sx={{ flex: 1 }} />
      </FlexBox>
      <DateTimeInput
        source='departedDate'
        label='Departure Date'
        sx={{ width: '50%' }}
      />
    </SimpleForm>
  )
}
