import React, { useState } from 'react'
import {
  CreateButton,
  List,
  TextField,
  TopToolbar,
  useRecordContext,
  SearchInput,
  FilterButton
} from 'react-admin'
import { Button, Chip } from '@mui/material'
import { Article } from '@mui/icons-material'
import UserMusterList from './UserMusterList'
import { rolesOptions } from '../../utils/options'
import useCanAccess from '../../hooks/useCanAccess'
import * as constants from '../../constants'
import DatagridConfigurableWithShow from '../../components/DatagridConfigurableWithShow'
import { ActiveFilter } from '../platforms/PlatformList'

interface Props {
  name: string
}

const filters = [
  <SearchInput source='q' key='q' alwaysOn />,
  <ActiveFilter
    source='departedDate_gte'
    label='Active Users'
    val={new Date().toISOString()}
    key='Active Users'
  />
]

export default function UserList(props: Props): React.ReactElement {
  const { name } = props
  const cName: string = name
  const basePath: string = `/${cName}`
  const { hasAccess } = useCanAccess()

  const hasWriteAccess = hasAccess(constants.R_USERS, { write: true })

  const ListActions = (): React.ReactElement => {
    return (
      <TopToolbar>
        <FilterButton />
        {hasWriteAccess ? <CreateButton to={`${basePath}/create`} /> : null}
      </TopToolbar>
    )
  }

  const [open, setOpen] = useState(false)
  const handleOpen = (open: boolean) => () => {
    setOpen(open)
  }
  const UserActions = (): React.ReactElement => {
    return (
      <>
        <Button
          startIcon={<Article />}
          sx={{ lineHeight: '1.5' }}
          size='small'
          onClick={handleOpen(true)}>
          User Muster List
        </Button>
      </>
    )
  }
  return (
    <List
      actions={<ListActions />}
      perPage={25}
      resource={cName}
      filters={filters}>
      <DatagridConfigurableWithShow
        resource={constants.R_USERS}
        bulkActionButtons={<UserActions />}>
        <TextField<User> source='staffNumber' label='Staff number' />
        <TextField<User> source='name' />
        <TextField label='Departure' source='departedDate' />
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
