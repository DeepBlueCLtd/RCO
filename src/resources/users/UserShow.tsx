import React, { useEffect, useState } from 'react'
import FlexBox from '../../components/FlexBox'
import { Box } from '@mui/system'
import ItemList, { BulkActions } from '../items/ItemList'
import {
  DatagridConfigurable,
  type DatagridConfigurableProps,
  EditButton,
  Loading,
  Show,
  SimpleForm,
  TextField,
  TextInput,
  TopToolbar,
  useGetList,
  useShowContext,
  useUpdate,
  useNotify,
  DateInput,
  useDataProvider,
  FunctionField
} from 'react-admin'
import {
  Chip,
  Typography,
  Button,
  Modal,
  InputAdornment,
  IconButton
} from '@mui/material'
import { R_AUDIT, R_ITEMS, R_USERS } from '../../constants'
import { nowDate } from '../../providers/dataProvider/dataprovider-utils'
import useCanAccess from '../../hooks/useCanAccess'
import {
  KeyboardReturn,
  Visibility,
  VisibilityOff,
  Warning
} from '@mui/icons-material'
import * as constants from '../../constants'
import { useNavigate, useParams } from 'react-router-dom'
import SourceField from '../../components/SourceField'
import HistoryButton from '../../components/HistoryButton'
import {
  checkIfDateHasPassed,
  checkIfUserIsActive,
  editUserPassowrd,
  getErrorDetails
} from '../../utils/helper'
import { DateTime } from 'luxon'
import useAudit, { type AuditFunction } from '../../hooks/useAudit'
import { AuditType } from '../../utils/activity-types'
import LockResetIcon from '@mui/icons-material/LockReset'
import { type AxiosError, isAxiosError } from 'axios'
import { getUser } from '../../providers/authProvider'
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
}

interface Props {
  handleClose: () => void
  record?: _Users
  setShowReturn?: React.Dispatch<React.SetStateAction<boolean>>
  audit: AuditFunction
}

const DepartOrganisation = ({
  handleClose,
  record,
  setShowReturn,
  audit
}: Props): React.ReactElement => {
  const dataProvider = useDataProvider()

  const handleDepartUser = (): void => {
    audit({
      activityType: AuditType.USER_DEPARTED,
      securityRelated: true,
      resource: R_USERS,
      subjectId: record?.id !== undefined ? record.id : null,
      dataId: record?.id !== undefined ? record.id : null,
      subjectResource: null,
      activityDetail: 'User departed organisation'
    }).catch(console.log)

    dataProvider
      .update(R_USERS, {
        id: record?.id,
        previousData: record,
        data: { departedDate: nowDate() }
      })
      .catch(console.log)

    if (setShowReturn !== undefined) setShowReturn(true)
    handleClose()
  }
  return (
    <Box sx={style}>
      <Typography variant='h6'>
        Are you sure this user is departing the organisation? Doing this will
        prevent items from being loaned to the user
      </Typography>
      <FlexBox marginTop='20px' justifyContent='center'>
        <Button variant='contained' onClick={handleDepartUser}>
          Confirm
        </Button>
        <Button variant='outlined' color='secondary' onClick={handleClose}>
          Cancel
        </Button>
      </FlexBox>
    </Box>
  )
}

const ResetPassword = ({
  handleClose,
  record,
  audit
}: Props): React.ReactElement => {
  const [update] = useUpdate()

  const handlePasswordReset = (): void => {
    audit({
      activityType: AuditType.PASSWORD_RESET,
      securityRelated: true,
      resource: R_USERS,
      subjectId: record?.id !== undefined ? record.id : null,
      dataId: record?.id !== undefined ? record.id : null,
      subjectResource: null,
      activityDetail: 'Password reset'
    }).catch(console.log)

    update(
      R_USERS,
      {
        id: record?.id,
        previousData: record,
        data: { password: '', lockoutAttempts: 0 }
      },
      { mutationMode: 'optimistic' }
    ).catch(console.log)
    handleClose()
  }

  return (
    <Box sx={style}>
      <Typography variant='h6'>
        Are you sure you want to reset the password for this user?
      </Typography>
      <FlexBox marginTop='20px' justifyContent='center'>
        <Button variant='contained' onClick={handlePasswordReset}>
          Confirm
        </Button>
        <Button variant='outlined' color='secondary' onClick={handleClose}>
          Cancel
        </Button>
      </FlexBox>
    </Box>
  )
}

const EditPassword = ({ handleClose }: Props): React.ReactElement => {
  const [showPassword, setShowPassword] = React.useState(false)
  const [password, setPassword] = useState<string>('')
  const [passwordError, setPasswordError] = useState('')
  const { id } = useParams()
  const notify = useNotify()
  const user = getUser()

  const handleEditPassword = (): void => {
    if (!id || user?.id.toString() === id) {
      notify('User cannot edit own password.', { type: 'error' })
      return
    }

    editUserPassowrd({
      newPassword: password,
      userId: parseInt(id)
    })
      .then((res) => {
        if (res.status === 201) {
          notify(res.data.message, { type: 'success' })
          handleClose()
        }
      })
      .catch((err) => {
        if (isAxiosError(err))
          notify(getErrorDetails(err as AxiosError).message, { type: 'error' })
        else notify((err as Error).message, { type: 'error' })
      })
  }

  const handleClickShowPassword = (): void => {
    setShowPassword((show) => !show)
  }

  const validatePassword = (value: string | string[]): void => {
    if (typeof value !== 'string') {
      setPasswordError('')
      return
    }
    if (value.length < 10) {
      setPasswordError('Password must be at least 10 characters long.')
      return
    }
    if (!/[A-Z]/.test(value) || !/[a-z]/.test(value)) {
      setPasswordError(
        'Password must contain both uppercase and lowercase letters.'
      )
      return
    }
    if (!/\d/.test(value)) {
      setPasswordError('Password must contain at least one digit.')
      return
    }
    if (!/[^a-zA-Z0-9]/.test(value)) {
      setPasswordError('Password must contain at least one special character.')
      return
    }
    setPasswordError('')
  }

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4
      }}>
      <Typography>
        <b>Edit User Password</b>
      </Typography>
      <Typography>
        The password should include these items:
        <ul>
          <li>At least 10 characters in length</li>
          <li>Upper and lower case letters</li>
          <li>At least one digit</li>
          <li>At least one special character</li>
        </ul>
      </Typography>
      <SimpleForm toolbar={false}>
        <TextInput
          type={showPassword ? 'text' : 'password'}
          source='hashed_password'
          label='New Password'
          variant='outlined'
          sx={{ width: '100%' }}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton onClick={handleClickShowPassword} edge='end'>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
          onChange={(e) => {
            const value = e.target.value
            setPassword(value)
            validatePassword(value)
          }}
          error={Boolean(passwordError)}
          helperText={
            <Typography sx={{ color: 'red', fontSize: '12px' }}>
              {passwordError}
            </Typography>
          }
        />
      </SimpleForm>
      <FlexBox marginTop='20px'>
        <Button variant='contained' onClick={handleEditPassword}>
          Confirm
        </Button>
        <Button variant='outlined' color='secondary' onClick={handleClose}>
          Cancel
        </Button>
      </FlexBox>
    </Box>
  )
}

interface UserShowCompType {
  setRecord: React.Dispatch<React.SetStateAction<_Users | undefined>>
  audit: AuditFunction
  handleEditPasswordClose: () => void
  editPasswordOpen: boolean
}

const UserShowComp = ({
  setRecord,
  audit,
  handleEditPasswordClose,
  editPasswordOpen
}: UserShowCompType): React.ReactElement => {
  const { record, isLoading } = useShowContext<_Users>()
  const [departOpen, setDepartOpen] = useState(false)
  const [resetOpen, setResetopen] = useState(false)
  const [showReturn, setShowReturn] = useState<boolean>(false)
  const loanedHistory = 'Loaned Items'
  const viewUser = 'View User'
  const loanedItems = useGetList<Item>(R_ITEMS, {
    sort: { field: 'id', order: 'ASC' },
    pagination: { page: 1, perPage: 10 },
    filter: { loanedTo: record?.id }
  })
  const { hasAccess } = useCanAccess()
  const hasWriteAccess = hasAccess(R_USERS, { write: true })
  const { id } = useParams()
  const [update] = useUpdate<_Users>()
  const notify = useNotify()

  useEffect(() => {
    setShowReturn(
      record?.departedDate !== null &&
        record?.departedDate !== undefined &&
        checkIfDateHasPassed(record?.departedDate)
    )
  }, [record?.departedDate])

  const handleDepartUser = (): void => {
    setDepartOpen(true)
  }

  const handleDepartClose = (): void => {
    setDepartOpen(false)
  }

  const handleResetPassowrd = (): void => {
    setResetopen(true)
  }

  const handleResetClose = (): void => {
    setResetopen(false)
  }

  const cannotDepart = (): boolean => {
    return (
      (loanedItems.data !== undefined && loanedItems.data?.length > 0) ||
      (record !== undefined && !checkIfUserIsActive(record)) ||
      !hasWriteAccess ||
      (record?.departedDate !== undefined &&
        record?.departedDate !== null &&
        checkIfDateHasPassed(record.departedDate))
    )
  }

  const handleUserReturn = (): void => {
    if (record !== null && record !== undefined) {
      audit({
        activityType: AuditType.USER_RETURNED,
        securityRelated: true,
        resource: R_USERS,
        subjectId: record?.id !== undefined ? record.id : null,
        dataId: record?.id !== undefined ? record.id : null,
        subjectResource: null,
        activityDetail: 'User returned to organisation'
      }).catch(console.log)

      update(constants.R_USERS, {
        id: record.id,
        previousData: record,
        data: {
          departedDate: DateTime.now().plus({ years: 10 }).toISO()
        }
      })
        .then(() => {
          setShowReturn(false)
        })
        .catch(console.log)
      notify('User Returned')
    }
  }

  useEffect(() => {
    if (!isLoading) setRecord(record)
  }, [isLoading])

  if (isLoading !== undefined && isLoading) return <Loading />

  return (
    <>
      <FlexBox alignItems='start'>
        <Box component='fieldset' style={{ width: '550px', padding: '0 15px' }}>
          <legend>
            <Typography variant='h5' align='center' sx={{ fontWeight: '600' }}>
              {viewUser}
            </Typography>
          </legend>
          <SimpleForm toolbar={false}>
            <TextInput
              disabled
              source='name'
              variant='outlined'
              sx={{ width: '100%' }}
            />
            <FlexBox>
              <Chip label={record?.role} />
              <TextInput
                disabled
                source='username'
                label='Username'
                sx={{ flex: 1 }}
              />
            </FlexBox>
            <FlexBox>
              <DateInput
                disabled
                source='departedDate'
                label={showReturn ? 'Departed' : 'Due to depart by'}
                sx={{ flex: 1 }}
              />
            </FlexBox>
            <FlexBox justifyContent='left'>
              <Button
                variant='outlined'
                sx={{ marginBottom: 1 }}
                disabled={cannotDepart()}
                title='Mark departure date to now, to prevent login'
                onClick={handleDepartUser}>
                Depart Organisation
              </Button>
              {loanedItems.data !== undefined &&
                loanedItems.data?.length > 0 && (
                  <>
                    <Warning sx={{ color: 'red' }} />
                    <Typography variant='subtitle1' sx={{ color: 'red' }}>
                      User still has items loaned
                    </Typography>
                  </>
                )}
            </FlexBox>
            <FlexBox justifyContent='left'>
              <Button
                disabled={
                  record?.departedDate !== undefined &&
                  record.departedDate !== null &&
                  checkIfDateHasPassed(record.departedDate)
                }
                variant='outlined'
                sx={{ marginBottom: 1 }}
                title='Clear user password. After logging in with username in both boxes they will be invited to enter a new one'
                onClick={handleResetPassowrd}>
                Reset Password
              </Button>
            </FlexBox>
            <FlexBox justifyContent='left'>
              <Button
                disabled={!showReturn}
                variant='outlined'
                title='Set their departure date to 10 years in the future'
                startIcon={<KeyboardReturn />}
                onClick={handleUserReturn}>
                Return to Organisation
              </Button>
            </FlexBox>
          </SimpleForm>
        </Box>
        <Box component='fieldset' style={{ padding: '0 15px' }}>
          <legend>
            <Typography variant='h5' align='center' sx={{ fontWeight: '600' }}>
              {loanedHistory}
            </Typography>
          </legend>
          <ItemList
            storeKey={`${constants.R_USERS}-${id}-items-list`}
            filter={{ loanedTo: record?.id }}>
            <ItemListDataTable
              preferenceKey={`datagrid-${constants.R_USERS}-${id}-items-list`}
            />
          </ItemList>
        </Box>
      </FlexBox>

      <Modal open={departOpen} onClose={handleDepartClose}>
        <div>
          <DepartOrganisation
            handleClose={handleDepartClose}
            record={record}
            setShowReturn={setShowReturn}
            audit={audit}
          />
        </div>
      </Modal>

      <Modal open={resetOpen} onClose={handleResetClose}>
        <div>
          {' '}
          <ResetPassword
            handleClose={handleResetClose}
            record={record}
            audit={audit}
          />
        </div>
      </Modal>

      <Modal open={editPasswordOpen} onClose={handleEditPasswordClose}>
        <div>
          <EditPassword
            handleClose={handleEditPasswordClose}
            record={record}
            audit={audit}
          />
        </div>
      </Modal>
    </>
  )
}

export default function UserShow(): React.ReactElement {
  const [record, setRecord] = useState<_Users>()
  const [editPasswordOpen, setEditPasswordOpen] = useState(false)
  const { hasAccess } = useCanAccess()
  const hasWriteAccess = hasAccess(R_USERS, { write: true })
  const { isLoading } = useGetList<Audit>(R_AUDIT, {})
  const audit = useAudit()
  const navigate = useNavigate()

  if (isLoading) return <Loading />

  const handleEditPasswordOpen = (): void => {
    setEditPasswordOpen(true)
  }

  const handleEditPasswordClose = (): void => {
    setEditPasswordOpen(false)
  }

  return (
    <Show
      resource={constants.R_USERS}
      actions={
        <TopToolbar sx={{ alignItems: 'center' }}>
          {hasWriteAccess && <EditButton />}
          <HistoryButton
            onClick={() => {
              if (record) {
                navigate(
                  `/audit?filter=${JSON.stringify({
                    resource: constants.R_USERS,
                    dataId: record.id ?? ''
                  })}`
                )
              }
            }}
          />
          {hasWriteAccess && (
            <Button onClick={handleEditPasswordOpen} sx={{ fontSize: '12px' }}>
              <LockResetIcon fontSize='medium' sx={{ paddingRight: '5px' }} />
              Edit Password
            </Button>
          )}
        </TopToolbar>
      }>
      <UserShowComp
        setRecord={setRecord}
        audit={audit}
        editPasswordOpen={editPasswordOpen}
        handleEditPasswordClose={handleEditPasswordClose}
      />
    </Show>
  )
}

function ItemListDataTable(
  props: DatagridConfigurableProps
): React.ReactElement {
  return (
    <DatagridConfigurable
      bulkActionButtons={<BulkActions />}
      rowClick='show'
      omit={props?.omit}
      preferenceKey={props.preferenceKey}
      {...props}>
      <FunctionField<RichItem>
        label='Reference'
        render={(record) => `${record.vault?.[0]}${record.itemNumber}`}
      />
      <SourceField<Item>
        link='show'
        source='mediaType'
        reference={constants.R_MEDIA_TYPE}
        label='Media type'
      />
      <SourceField<Item>
        source='protectiveMarking'
        reference='protectiveMarking'
      />
      <TextField<Item> source='remarks' />
    </DatagridConfigurable>
  )
}
