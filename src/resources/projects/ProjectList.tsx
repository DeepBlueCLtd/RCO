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
import CreatedByMeFilter from '../../components/CreatedByMeFilter'
import SourceInput from '../../components/SourceInput'
import * as constants from '../../constants'

const filters = [
  <SearchInput source='q' key='q' alwaysOn />,
  <CreatedByMeFilter
    key='createdByMe'
    source='createdBy_eq'
    label='Created By Me'
  />,
  <SourceInput
    key='createdBy'
    source='createdBy'
    reference={constants.R_USERS}
  />
]

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
