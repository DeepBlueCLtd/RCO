import React, { useState } from 'react'
import {
  BooleanField,
  CreateButton,
  Datagrid,
  List,
  TextField,
  TopToolbar,
  ArrayField,
  SingleFieldList,
  useRecordContext
} from 'react-admin'
import { Button, Chip } from '@mui/material'
import { Article } from '@mui/icons-material'
import UserMusterList from './UserMusterList'
import { rolesOptions } from '../../utils/options'
import useCanAccess from '../../hooks/useCanAccess'
import * as constants from '../../constants'

interface Props {
  name: string
}

export default function UserList(props: Props): React.ReactElement {
  const { name } = props
  const cName: string = name
  const basePath: string = `/${cName}`
  const [open, setOpen] = useState(false)
  const { hasAccess } = useCanAccess()

  const hasWriteAccess = hasAccess(constants.R_USERS, { write: true })

  const ListActions = (): React.ReactElement => {
    return (
      <TopToolbar>
        {hasWriteAccess ? <CreateButton to={`${basePath}/create`} /> : null}
      </TopToolbar>
    )
  }

  const handleOpen = (open: boolean) => () => {
    setOpen(open)
  }

  return (
    <List actions={<ListActions />} perPage={25} resource={cName}>
      <Datagrid
        rowClick='show'
        bulkActionButtons={
          <Button
            startIcon={<Article />}
            sx={{ lineHeight: '1.5' }}
            size='small'
            onClick={handleOpen(true)}>
            User Muster List
          </Button>
        }>
        <TextField source='staffNumber' label='Staff number' />
        <TextField source='name' />
        <BooleanField source='adminRights' label='Admin Rights' />
        <BooleanField source='active' label='Active User' />
        <ArrayField source='roles'>
          <SingleFieldList sx={{ columnGap: 1 }}>
            <ChipField />
          </SingleFieldList>
        </ArrayField>
      </Datagrid>
      <UserMusterList open={open} onClose={handleOpen(false)} />
    </List>
  )
}

function ChipField(): React.ReactElement {
  const record = useRecordContext<any>()

  const role = rolesOptions.find(({ value }) => value === record)

  if (typeof role === 'undefined') return <></>

  return <Chip size='small' label={role.label} />
}
