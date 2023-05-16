import React, { useState } from 'react'
import {
  BooleanField,
  CreateButton,
  Datagrid,
  type Identifier,
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

interface Props {
  name: string
}

export default function UserList(props: Props): React.ReactElement {
  const { name } = props
  const cName: string = name
  const basePath: string = `/${cName}`
  const [open, setOpen] = useState(false)

  const ListActions = (): React.ReactElement => {
    return (
      <TopToolbar>
        <CreateButton to={`${basePath}/create`} />
      </TopToolbar>
    )
  }

  const handleOpen = (open: boolean) => () => {
    setOpen(open)
  }

  return (
    <List actions={<ListActions />} perPage={25} resource={cName}>
      <Datagrid
        rowClick={(id: Identifier) => {
          const cID: string = id.toString()
          return `${basePath}/${cID}`
        }}
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
