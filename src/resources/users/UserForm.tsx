import React, { useEffect, useState } from 'react'
import {
  SimpleForm,
  TextInput,
  useEditContext,
  SelectInput,
  DateTimeInput,
  SaveButton,
  useCreate,
  SaveContextProvider,
  useRedirect
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

import { R_USERS } from '../../constants'
import { getUser } from '../../providers/authProvider'

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
interface UserDetails {
  name: string
  hashed_password?: string
  role: UserRole
  is_superuser: boolean
  username: string
  departedDate: string | null
  lastUpdatedAt: string | null
  lockoutAttempts: number
  updateBefore: string
}

const BASE_URL = process.env.API_BASE_URL_KEY ?? 'http://localhost:8000'

const SaveButtonContext: React.FC<any> = (props: {
  selectUser: string
  children: React.ReactNode
}) => {
  const [create] = useCreate()
  const redirect = useRedirect()
  const createUserRole = async (
    val: UserDetails,
    selectUser: string
  ): Promise<number | undefined> => {
    try {
      const userResponse = await axios.get(
        `${BASE_URL}/api/tables/_users/rows?_filters=username:${val.username}`
      )
      const userId = userResponse.data.data[0]?.id
      if (!userId) {
        return
      }
      const roleResponse = await axios.get(
        `${BASE_URL}/api/tables/_users_roles/rows?_filters=user_id:${userId}`
      )
      const roleId = roleResponse.data.data[0]?.id

      if (!roleId) {
        return
      }

      const updateResponse = await axios.put(
        `${BASE_URL}/api/tables/_users_roles/rows/${roleId}`,
        {
          fields: { role_id: selectUser }
        }
      )
      redirect(`/${R_USERS}/${userId}/show`)
      console.log('User role updated successfully', updateResponse)
    } catch (error) {
      console.error('Error updating user role:', error)
      throw error
    }
  }

  const save = async (val: UserDetails): Promise<void> => {
    await create(
      R_USERS,
      { data: { ...val } },
      {
        onSettled: () => {
          createUserRole(val, props.selectUser).catch(console.log)
        }
      }
    )
  }
  const saving = false
  const mutationMode = 'pessimistic'

  return (
    <SaveContextProvider value={{ save, saving, mutationMode }}>
      {props.children}
    </SaveContextProvider>
  )
}

const CustomSaveButton: React.FC<{
  updateUserRole: UpdateUserRoleFunction
  selectUser: string
  isEdit: boolean
  touched: boolean
}> = ({ updateUserRole, selectUser, touched, isEdit }) => {
  // const { record } = useEditContext()

  return (
    <div style={{ padding: '10px 15px' }}>
      <SaveButtonContext selectUser={selectUser}>
        <SaveButton
          type={isEdit ? undefined : 'button'}
          alwaysEnable={touched}
          onClick={() => {
            if (isEdit) {
              updateUserRole()
                .then(() => {})
                .catch((error) => {
                  console.error('Error updating user role:', error)
                })
            }
          }}
        />
      </SaveButtonContext>
    </div>
  )
}

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
interface FormProps {
  isEdit: boolean
}
export default function UserForm({ isEdit }: FormProps): React.ReactElement {
  const { record } = useEditContext()
  const userDetails = getUser()
  const pageTitle = isEdit ? 'Edit User' : 'Add new User'
  const [selectUser, setSelectUser] = useState<string>('1')
  const [touched, setTouched] = useState(false)
  let originalUser: any = null
  const [userRoleId, setUserRoleId] = useState<any[]>([])

  const fetchData = async (): Promise<void> => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/tables/_users_roles/rows?_filters=user_id:${record.id}`
      )
      setUserRoleId(response.data.data)
      setSelectUser((response.data.data[0]?.role_id as string) || '')
      originalUser = (response.data.data[0]?.role_id as string) || ''
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    if (userDetails?.role === 'rco-power-user' && isEdit) {
      fetchData().catch((error) => {
        console.error('Error in fetchData:', error)
      })
    }
  }, [userDetails?.role, isEdit])

  const updateUserRole: UpdateUserRoleFunction = async (): Promise<void> => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/tables/_users_roles/rows/${userRoleId[0]?.id}`,
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
      toolbar={
        <CustomSaveButton
          updateUserRole={updateUserRole}
          selectUser={selectUser}
          isEdit={isEdit}
          touched={touched}
        />
      }
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
      {!isEdit ? (
        <TextInput source='password' label='Password' sx={{ width: '100%' }} />
      ) : null}
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
            if (e.target.value !== originalUser) setTouched((prev) => !prev)
            setSelectUser(e.target.value)
          }}>
          <MenuItem value='1'>
            <em>None</em>
          </MenuItem>
          <MenuItem value='2'>RCO User</MenuItem>
          <MenuItem value='3'>RCO Power User</MenuItem>
        </Select>
      </FormControl>
    </SimpleForm>
  )
}
