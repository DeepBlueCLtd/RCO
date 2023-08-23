import React from 'react'
import {
  BooleanField,
  CreateButton,
  DatagridConfigurable,
  DateField,
  FilterButton,
  List,
  SearchInput,
  SelectColumnsButton,
  TextField,
  TopToolbar
} from 'react-admin'
import CreatedByMeFilter from '../../components/CreatedByMeFilter'
import DateFilter, { ResetDateFilter } from '../../components/DateFilter'
import SourceInput from '../../components/SourceInput'
import * as constants from '../../constants'
import useCanAccess from '../../hooks/useCanAccess'

const omitColumns: string[] = ['createdAt']

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
  />,
  <DateFilter
    key='createdAt'
    source='createdAt'
    label='Created At'
    format='iso'
  />
]

export default function ProjectList(): React.ReactElement {
  const { hasAccess } = useCanAccess()
  const ListActions = (): React.ReactElement => (
    <TopToolbar>
      <FilterButton />
      {hasAccess(constants.R_PROJECTS, { write: true }) ? (
        <CreateButton />
      ) : null}
      <SelectColumnsButton />
    </TopToolbar>
  )

  return (
    <List actions={<ListActions />} perPage={25} filters={filters}>
      <ResetDateFilter source='createdAt' />
      <DatagridConfigurable
        omit={omitColumns}
        rowClick='show'
        bulkActionButtons={false}>
        <TextField source='name' />
        <TextField source='remarks' />
        <TextField source='createdAt' label='Created' />
        <DateField source='startDate' label='Start' />
        <DateField source='endDate' label='End' />
        <BooleanField source='enduring' looseValue />
      </DatagridConfigurable>
    </List>
  )
}
