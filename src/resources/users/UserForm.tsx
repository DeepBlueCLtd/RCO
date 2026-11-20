import React, { useEffect, useState } from 'react'
import {
  SimpleForm,
  TextInput,
  useEditContext,
  DateTimeInput,
  SaveButton,
  useCreate,
  SaveContextProvider,
  useRedirect,
  useNotify
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

import {
  R_USERS,
  PASSWORD_INSTRUCTION_TITLE,
  PASSWORD_VALIDATION_CRITERIA
} from '../../constants'
import useAudit from '../../hooks/useAudit'
import { AuditType } from '../../utils/activity-types'
import { common } from '../../utils/password-validation.schema'
import { getUser } from '../../providers/authProvider'

const schema = yup.object({
  name: yup.string().required(),
  password: common
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

const ROLE_OPTIONS = [
  { value: '1', label: 'None' },
  { value: '2', label: 'RCO User' },
  { value: '3', label: 'RCO Power User' }
]

// Superusers outrank every role
const SUPERUSER_LEVEL = ROLE_OPTIONS.length + 1

// The highest role the logged-in user may assign: their own
const currentUserLevel = (): number => {
  const user = getUser()
  if (user === undefined) return 0
  if (user.is_superuser) return SUPERUSER_LEVEL
  if (user.userRole === 'rco-power-user') return 3
  if (user.userRole === 'rco-user') return 2
  return 1
}

// The server checks the caller may assign this role to this user
const setUserRole = async (userId: number, roleId: string): Promise<void> => {
  await axios.post(`${BASE_URL}/api/set-user-role`, {
    fields: { userId, roleId: Number(roleId) }
  })
}

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
    await setUserRole(Number(userId), selectUser)

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
  const notify = useNotify()
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
                .catch(() => {
                  notify('The user role could not be changed', {
                    type: 'error'
                  })
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
  const [originalRole, setOriginalRole] = useState<string>('')
  const level = currentUserLevel()
  const roleOptions = ROLE_OPTIONS.filter(
    (option) => Number(option.value) <= level
  )
  // users above your own level keep their role
  const roleLocked =
    isEdit &&
    ((Boolean(record?.is_superuser) && level < SUPERUSER_LEVEL) ||
      Number(originalRole || 0) > level)

  const fetchData = async (): Promise<void> => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/tables/_users_roles/rows?_filters=user_id:${record.id}`
      )
      const roleId = String(response.data.data[0]?.role_id ?? '')
      setSelectUser(roleId)
      setOriginalRole(roleId)
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
    if (roleLocked || selectUser === '' || selectUser === originalRole) return
    try {
      await setUserRole(Number(record.id), selectUser)
      setOriginalRole(selectUser)
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
          disabled={roleLocked}
          onChange={(e) => {
            if (e.target.value !== originalRole) setTouched((prev) => !prev)
            setSelectUser(e.target.value)
          }}>
          {(roleLocked ? ROLE_OPTIONS : roleOptions).map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.value === '1' ? <em>{option.label}</em> : option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Typography
        component={'div'}
        sx={{
          marginTop: '30px',
          marginBottom: '-20px',
          fontSize: '14px'
        }}>
        <span
          style={{
            fontWeight: '600',
            fontSize: '18px'
          }}>
          Departure Date
        </span>{' '}
        This is the date when the user will no longer be able to log into VAL.
        If the user needs to be reactivated, this date can be updated.
        <br />
        <span
          style={{
            fontWeight: '600',
            fontSize: '18px'
          }}>
          Password
        </span>{' '}
        {PASSWORD_INSTRUCTION_TITLE}
        <ul>
          {PASSWORD_VALIDATION_CRITERIA.map((criteria, index) => (
            <li key={index}>{criteria}</li>
          ))}
        </ul>
        <span
          style={{
            fontWeight: '600',
            fontSize: '18px'
          }}>
          User Role
        </span>{' '}
        The above user roles have these permissions in VAL:
        <ul>
          <li>
            <b>None</b> this user can log into VAL, but cannot make any changes
            to any data
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
      </Typography>
    </SimpleForm>
  )
}
