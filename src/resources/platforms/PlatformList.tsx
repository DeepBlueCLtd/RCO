import React from 'react'
import {
  BooleanField,
  BulkDeleteButton,
  CreateButton,
  Datagrid,
  DeleteButton,
  EditButton,
  List,
  TextField,
  TopToolbar
} from 'react-admin'

export default function PlatformList(): React.ReactElement {
  const ListActions = (): React.ReactElement => (
    <TopToolbar>
      <CreateButton />
    </TopToolbar>
  )

  return (
    <List actions={<ListActions />} perPage={25}>
      <Datagrid
        rowClick="show"
        bulkActionButtons={<BulkDeleteButton mutationMode="pessimistic" />}
      >
        <TextField source="name" />
        <BooleanField source="active" label="Active Platform" />
        <EditButton />
        <DeleteButton mutationMode="pessimistic" />
      </Datagrid>
    </List>
  )
}
