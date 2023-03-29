import React from 'react'
import {
  BulkDeleteButton,
  CreateButton,
  Datagrid,
  DateField,
  List,
  TextField,
  TopToolbar
} from 'react-admin'

export default function ProjectList(): React.ReactElement {
  const ListActions = () => (
    <TopToolbar>
      <CreateButton />
    </TopToolbar>
  )

  return (
    <List actions={<ListActions />} perPage={25}>
      <Datagrid
        rowClick='show'
        bulkActionButtons={<BulkDeleteButton mutationMode='pessimistic' />}
      >
        <TextField source='name' />
        <DateField source='start_date' />
        <DateField source='end_date' />
        <TextField source='project_code' />
        <TextField source='remarks' />
      </Datagrid>
    </List>
  )
}
