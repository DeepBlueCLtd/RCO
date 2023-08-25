import React, { useEffect, useState } from 'react'
import {
  BooleanField,
  CreateButton,
  List,
  TextField,
  TopToolbar,
  useRecordContext,
  useListContext,
  useUpdate,
  useNotify
} from 'react-admin'
import { Button, Chip } from '@mui/material'
import { Article, KeyboardReturn } from '@mui/icons-material'
import UserMusterList from './UserMusterList'
import { rolesOptions } from '../../utils/options'
import useCanAccess from '../../hooks/useCanAccess'
import * as constants from '../../constants'
import DatagridConfigurableWithShow from '../../components/DatagridConfigurableWithShow'

interface Props {
  name: string
}

export default function UserList(props: Props): React.ReactElement {
  const { name } = props
  const cName: string = name
  const basePath: string = `/${cName}`
  const { hasAccess } = useCanAccess()

  const hasWriteAccess = hasAccess(constants.R_USERS, { write: true })

  const ListActions = (): React.ReactElement => {
    return (
      <TopToolbar>
        {hasWriteAccess ? <CreateButton to={`${basePath}/create`} /> : null}
      </TopToolbar>
    )
  }

  const [open, setOpen] = useState(false)
  const handleOpen = (open: boolean) => () => {
    setOpen(open)
  }
  const UserActions = (): React.ReactElement => {
    const { selectedIds, data } = useListContext()
    const [showReturn, setShowReturn] = useState<boolean>(false)
    const [selectedUser, setSelectedUser] = useState<User[] | null>(null)
    const [update] = useUpdate<User>()
    const notify = useNotify()

    useEffect(() => {
      const users = data.filter((user: User) => selectedIds.includes(user.id))
      setSelectedUser(users)
      setShowReturn(
        users.every((user: User) => user.departedDate !== undefined)
      )
    }, [selectedIds, data])

    const handleUserReturn = (): void => {
      if (selectedUser !== null) {
        selectedUser.forEach((user) => {
          update(constants.R_USERS, {
            id: user.id,
            previousData: user,
            data: {
              departedDate: undefined,
              active: true
            }
          }).catch(console.log)
        })
        notify('User Returned')
      }
    }

    return (
      <>
        <Button
          startIcon={<Article />}
          sx={{ lineHeight: '1.5' }}
          size='small'
          onClick={handleOpen(true)}>
          User Muster List
        </Button>
        {showReturn && (
          <Button
            startIcon={<KeyboardReturn />}
            sx={{ lineHeight: '1.5' }}
            size='small'
            onClick={handleUserReturn}>
            Return
          </Button>
        )}
      </>
    )
  }
  return (
    <List actions={<ListActions />} perPage={25} resource={cName}>
      <DatagridConfigurableWithShow
        resource={constants.R_USERS}
        bulkActionButtons={<UserActions />}>
        <TextField<User> source='staffNumber' label='Staff number' />
        <TextField<User> source='name' />
        <BooleanField<User>
          source='adminRights'
          label='Admin Rights'
          looseValue
        />
        <BooleanField<User> source='active' label='Active User' looseValue />
        <ChipField />
      </DatagridConfigurableWithShow>
      <UserMusterList<User> open={open} onClose={handleOpen(false)} />
    </List>
  )
}

function ChipField(): React.ReactElement {
  const record = useRecordContext<any>()
  const role = rolesOptions.find(({ value }) => value === record.role)

  if (typeof role === 'undefined') return <></>

  return <Chip size='small' label={role.label} />
}
