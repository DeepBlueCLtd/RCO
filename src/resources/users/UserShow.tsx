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
  FunctionField,
  LoadingIndicator
} from 'react-admin'
import {
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
import axios, { isAxiosError } from 'axios'
import * as Yup from 'yup';
import { getUser } from '../../providers/authProvider'
import { common } from '../../utils/password-validation.schema'
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

const EditPassword = ({ handleClose, audit }: Props): React.ReactElement => {
  const [showPassword, setShowPassword] = React.useState(false)
  const [password, setPassword] = React.useState<string>('');
  const [passwordError, setPasswordError] = useState('')
  const { id } = useParams()
  const notify = useNotify()
  const user = getUser()

  const handleEditPassword = async (): Promise<void> => {
    try {
      await common.validate(password);
      setPassword('')
      if (!id || user?.id.toString() === id) {
        notify('User cannot edit own password.', { type: 'error' });
        return;
      }

      const response = await editUserPassowrd({
        newPassword: password,
        userId: parseInt(id)
      });

      if (response.status === 201) {
        await audit({
          resource: constants.R_USERS,
          activityType: AuditType.EDIT_PASSWORD,
          dataId: parseInt(id),
          activityDetail: 'Edit (other) User Password',
          securityRelated: true,
          subjectResource: null,
          subjectId: null
        });
        notify(response.data.message, { type: 'success' });
        handleClose();
      }
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        setPasswordError(error.message);
      } else {
        if (isAxiosError(error)) {
          notify(getErrorDetails(error).message, { type: 'error' });
        } else {
          notify((error as Error).message, { type: 'error' });
        }
      }
    }
  };

  const handleClickShowPassword = (): void => {
    setShowPassword((show) => !show);
  };

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
        <b>Provide Temporary Password</b>
      </Typography>
      <Typography>
        {constants.PASSWORD_INSTRUCTION_TITLE} 
        <ul>
          {constants.PASSWORD_VALIDATION_CRITERIA.map((criteria, index) => (
            <li key={index}>{criteria}</li>
          ))}
        </ul>
         The temporary password will be valid for one hour. If not updated in
        that time a new one must be provided.
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
          onChange={async (e) => {
            const value = e.target.value as string;
            setPassword(value);
            try {
              await common.validate(value);
              setPasswordError('');
            } catch (error) {
              // debugger
              if (error instanceof Yup.ValidationError) {
                setPasswordError(error.message);
              }
            }
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
  const [showReturn, setShowReturn] = useState<boolean>(false)
  const [userRoleId, setUserRoleId] = useState<string>('')
  const [loading, setLoading] = useState(true)
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

  const BASE_URL =
    process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : ''

  const fetchData = async (): Promise<void> => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/tables/_users_roles/rows?_filters=user_id:${record?.id}`
      )
      setUserRoleId(response.data.data[0]?.role_id as string)
      setLoading(false)
    } catch (error) {
      throw new Error(`Error fetching data: ${error}`)
    }
  }
  useEffect(() => {
    fetchData()
      .then(() => {})
      .catch((error) => {
        throw error
      })
  }, [record?.id])

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

            <TextInput
              disabled
              source='username'
              label='Username'
              sx={{ flex: 1 }}
            />

            <FlexBox>
              <DateInput
                disabled
                source='departedDate'
                label={showReturn ? 'Departed' : 'Due to depart by'}
                sx={{ flex: 1 }}
              />
            </FlexBox>
            <Typography
              align='center'
              sx={{
                fontWeight: '200',
                border: '1px dotted gray',
                width: '100%',
                textAlign: 'left',
                padding: '10px',
                borderRadius: '3px',
                fontSize: '14px',
                color: 'gray',
                margin: '5px 0'
              }}>
              User Role:{' '}
              {loading ? (
                <LoadingIndicator />
              ) : parseInt(userRoleId) === 1 ? (
                'Default Role'
              ) : parseInt(userRoleId) === 2 ? (
                'RCO User'
              ) : parseInt(userRoleId) === 3 ? (
                'RCO Power User'
              ) : (
                'User have no role'
              )}
            </Typography>

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
  const userDetails = getUser()
  const audit = useAudit()
  const navigate = useNavigate()

  if (isLoading) return <Loading />

  const handleEditPasswordOpen = (): void => {
    setEditPasswordOpen(true)
  }

  const handleEditPasswordClose = (): void => {
    setEditPasswordOpen(false)
  }

  const rolesThatCanEditPassword = ['rco-user', 'rco-power-user']

  return (
    <Show
      resource={constants.R_USERS}
      actions={
        <TopToolbar sx={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            {hasWriteAccess && <EditButton />}
            {userDetails &&
            rolesThatCanEditPassword.includes(userDetails.userRole) ? (
              <Button
                onClick={handleEditPasswordOpen}
                sx={{ fontSize: '12px' }}>
                <LockResetIcon fontSize='medium' sx={{ paddingRight: '5px' }} />
                Edit Password
              </Button>
            ) : null}
          </div>
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
