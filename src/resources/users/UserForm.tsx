import React, { useEffect, useState } from 'react'
import {
  SimpleForm,
  TextInput,
  useEditContext,
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
import FlexBox from '../../components/FlexBox'
import { DateTime } from 'luxon'
import axios from 'axios'

import { R_USERS } from '../../constants'
import useAudit from '../../hooks/useAudit'
import { AuditType } from '../../utils/activity-types'
import { passwordValidationSchema } from '../../utils/password-validation.schema'

const schema = yup.object({
  name: yup.string().required(),
  password: passwordValidationSchema
})

type UpdateUserRoleFunction = () => Promise<void>
interface UserDetails {
  name: string
  id: number
  hashed_password?: string
  is_superuser: boolean
  username: string
  departedDate: string | null
  lastUpdatedAt: string | null
  lockoutAttempts: number
  updateBefore: string
}

const BASE_URL =
  process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : ''

const SaveButtonContext: React.FC<any> = (props: {
  selectUser: string
  children: React.ReactNode
}) => {
  const [create] = useCreate()
  const redirect = useRedirect()
  const audit = useAudit()
  const createUserRole = async (
    val: UserDetails,
    selectUser: string
  ): Promise<number | undefined> => {
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
      // no existing user_role, create a new one
      await axios.post(`${BASE_URL}/api/tables/_users_roles/rows`, {
        fields: { user_id: val.id, role_id: selectUser }
      })
    } else {
      await axios.put(`${BASE_URL}/api/tables/_users_roles/rows/${roleId}`, {
        fields: { role_id: selectUser }
      })
    }

    redirect(`/${R_USERS}/${userId}/show`)
  }

  const save = async (val: UserDetails): Promise<void> => {
    await create(
      R_USERS,
      { data: { ...val } },
      {
        onSettled: async () => {
          createUserRole(val, props.selectUser).catch(console.log)
          await audit({
            resource: R_USERS,
            activityType: AuditType.CREATE,
            dataId: val.id,
            activityDetail: 'User Created',
            securityRelated: true,
            subjectResource: null,
            subjectId: null
          })
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
const now = new Date()
const futureTime = new Date(now.getTime() + 60 * 60000)
const futureTimeString = futureTime.toISOString()

const defaultValues: Omit<
  _Users,
  | 'id'
  | 'createdAt'
  | 'createdBy'
  | 'hashed_password'
  | 'username'
  | 'lastUpdatedAt'
  | 'lockoutAttempts'
> = {
  name: '',

  departedDate: valueWithTenYears,
  is_superuser: false,
  updateBefore: futureTimeString
}
interface FormProps {
  isEdit: boolean
}
export default function UserForm({ isEdit }: FormProps): React.ReactElement {
  const { record } = useEditContext()

  const pageTitle = isEdit ? 'Edit User' : 'Add new User'
  const passwordText =
    'Note: the new user will need to login using this temporary password within 60 minutes. If they fail to do that, they will need to be provided with a new temporary password.'
  const [selectUser, setSelectUser] = useState<string>('1')
  const [touched, setTouched] = useState(false)
  let originalUser: any = null
  const [userRoleId, setUserRoleId] = useState<string>('')

  const fetchData = async (): Promise<void> => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/tables/_users_roles/rows?_filters=user_id:${record.id}`
      )
      setUserRoleId(response.data.data[0]?.id as string)
      setSelectUser((response.data.data[0]?.role_id as string) || '')
      originalUser = (response.data.data[0]?.role_id as string) || ''
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    if (isEdit) {
      fetchData().catch((error) => {
        console.error('Error in fetchData:', error)
      })
    }
  }, [isEdit])

  const updateUserRole: UpdateUserRoleFunction = async (): Promise<void> => {
    try {
      if (userRoleId === undefined) {
        const response = await axios.post(
          `${BASE_URL}/api/tables/_users_roles/rows`,
          { fields: { user_id: record.id, role_id: selectUser } }
        )
        console.log('User role created successfully:', response.data)
        return response.data
      } else {
        const response = await axios.put(
          `${BASE_URL}/api/tables/_users_roles/rows/${userRoleId}`,
          { fields: { role_id: selectUser } }
        )
        console.log('User role updated successfully:', response.data)
        return response.data
      }
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
        <TextInput source='username' label='Username' sx={{ flex: 1 }} />
        <DateTimeInput
          source='departedDate'
          label='Departure Date'
          sx={{ width: '50%' }}
        />
      </FlexBox>
      {!isEdit ? (
        <>
          <TextInput
            source='password'
            label='Password'
            sx={{ width: '100%' }}
          />
          <Typography
            sx={{
              color: 'red',
              fontSize: '14px'
            }}>
            {passwordText}
          </Typography>
        </>
      ) : null}

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
      <Typography
        sx={{
          marginTop: '30px',
          marginBottom: '-20px',
          fontSize: '14px'
        }}>
        <p>
          <span
            style={{
              fontWeight: '600',
              fontSize: '18px'
            }}>
            Departure Date
          </span>{' '}
          This is the date when the user will no longer be able to log into VAL.
          If the user needs to be reactivated, this date can be updated.
        </p>

        <p>
          <span
            style={{
              fontWeight: '600',
              fontSize: '18px'
            }}>
            Password
          </span>{' '}
          The password should include these items:
          <ul>
            <li>At least 10 characters in length</li>
            <li>Upper and lower case letters</li>
            <li>At least one digit</li>
            <li>At least one special character</li>
          </ul>
        </p>
        <p>
          <span
            style={{
              fontWeight: '600',
              fontSize: '18px'
            }}>
            User Role
          </span>
          The above user roles have these permissions in VAL:
          <ul>
            <li>
              <b>None</b> this user can log into VAL, but cannot make any
              changes to any data
            </li>
            <li>
              <b>RCO-User</b> can perform all VAL processes (including setting
              temporary passwords), with the exception of editing some rarely
              changing drop-down lists
            </li>
            <li>
              <b>RCO-Power-User</b> can perform all processes of RCO-User, plus
              can modify drop-down lists (such as media-type or vault-location)
            </li>
          </ul>
        </p>
      </Typography>
    </SimpleForm>
  )
}
