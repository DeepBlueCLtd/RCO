import React, { useEffect, useState } from 'react'
import {
  SimpleForm,
  TextInput,
  useEditContext,
  SelectInput,
  DateTimeInput,
  SaveButton
} from 'react-admin'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography
} from '@mui/material'
import { rolesOptions } from '../../utils/options'
import FlexBox from '../../components/FlexBox'
import { DateTime } from 'luxon'
import axios from 'axios'
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

type UpdateUserRoleFunction = () => Promise<void>

const CustomSaveButton: React.FC<{
  updateUserRole: UpdateUserRoleFunction
}> = ({ updateUserRole }) => (
  <div style={{ padding: '10px 15px' }}>
    <SaveButton
      onClick={() => {
        updateUserRole()
          .then(() => {})
          .catch((error) => {
            console.error('Error updating user role:', error)
          })
      }}
    />
  </div>
)

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
    departedDate: valueWithTenYears,
    is_superuser: false,
    updateBefore: ''
  }
  const { record } = useEditContext()
  const pageTitle = isEdit !== undefined ? 'Edit User' : 'Add new User'
  const [selectUser, setSelectUser] = useState('')
  const [userRoleId, setUserRoleId] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/tables/_users_roles/rows?_filters=user_id:${record.id}`
        )
        setUserRoleId(response.data.data)
        setSelectUser(response.data.data[0]?.role_id || '')
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData().catch((error) => {
      console.error('Error in fetchData:', error)
    })
  }, [])

  const updateUserRole: UpdateUserRoleFunction = async (): Promise<void> => {
    try {
      const response = await axios.put(
        `http://localhost:8000/api/tables/_users_roles/rows/${userRoleId[0]?.id}`,
        { fields: { role_id: selectUser } }
      )
      console.log('User role updated successfully:', response.data)
      return response.data
    } catch (error) {
      console.error('Error updating user role:', error)
      throw error
    }
  }

  return (
    <SimpleForm
      record={{ ...record }}
      toolbar={<CustomSaveButton updateUserRole={updateUserRole} />}
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

      <FormControl variant='filled' sx={{ width: '50%' }}>
        <InputLabel id='demo-simple-select-filled-label'>User Role</InputLabel>
        <Select
          labelId='demo-simple-select-filled-label'
          id='demo-simple-select-filled'
          value={selectUser}
          onChange={(e) => {
            setSelectUser(e.target.value)
          }}>
          <MenuItem value=''>
            <em>None</em>
          </MenuItem>
          <MenuItem value={2}>RCO User</MenuItem>
          <MenuItem value={3}>RCO Power User</MenuItem>
        </Select>
      </FormControl>
    </SimpleForm>
  )
}
