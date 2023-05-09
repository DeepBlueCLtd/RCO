import React, { useState } from 'react'
import {
  BooleanField,
  BulkDeleteButton,
  CreateButton,
  Datagrid,
  DeleteButton,
  EditButton,
  type Identifier,
  List,
  TextField,
  TopToolbar,
  useRecordContext
} from 'react-admin'
import { Button } from '@mui/material'
import { Article } from '@mui/icons-material'
import UserMusterList from './UserMusterList'

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

  const CustomEditButton = (): React.ReactElement => {
    const record = useRecordContext(props)
    const id: string = record.id.toString()
    return <EditButton to={`${basePath}/${id}`} />
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
          <>
            <Button
              startIcon={<Article />}
              sx={{ lineHeight: '1.5' }}
              size='small'
              onClick={handleOpen(true)}>
              User Muster List
            </Button>
            <BulkDeleteButton mutationMode='pessimistic' />
          </>
        }>
        <TextField source='name' />
        <BooleanField source='adminRights' label='Admin Rights' />
        <CustomEditButton />
        <DeleteButton mutationMode='pessimistic' />
      </Datagrid>
      <UserMusterList open={open} onClose={handleOpen(false)} />
    </List>
  )
}
