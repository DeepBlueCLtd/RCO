import React from 'react'
import {
  BulkDeleteButton,
  CreateButton,
  Datagrid,
  DateField,
  FilterButton,
  List,
  SearchInput,
  TextField,
  TopToolbar
} from 'react-admin'

const filters = [<SearchInput source='name' key='name' alwaysOn />]

export default function ProjectList(): React.ReactElement {
  const ListActions = () => (
    <TopToolbar>
      <FilterButton />
      <CreateButton />
    </TopToolbar>
  )

  return (
    <List actions={<ListActions />} perPage={25} filters={filters}>
      <Datagrid
        rowClick='show'
        bulkActionButtons={<BulkDeleteButton mutationMode='pessimistic' />}>
        <TextField source='name' />
        <DateField source='startDate' />
        <DateField source='endDate' />
        <TextField source='projectCode' />
        <TextField source='remarks' />
      </Datagrid>
    </List>
  )
}
