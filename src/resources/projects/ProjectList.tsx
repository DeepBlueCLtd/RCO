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
import SourceField from '../../components/SourceField'
import { ActiveFilter } from '../platforms/PlatformList'

const omitColumns: string[] = ['createdAt', 'createdBy']

const filters = [
  <SearchInput source='q' key='q' alwaysOn />,
  <ActiveFilter source='active' key='active' label='Active' />,
  <ActiveFilter source='enduring' key='enduring' label='Enduring' />,
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
        <TextField<Project> source='name' />
        <TextField<Project> source='remarks' />
        <DateField<Project> source='startDate' label='Start' />
        <DateField<Project> source='endDate' label='End' />
        <BooleanField<Project> source='enduring' looseValue />
        <BooleanField<Project> source='active' looseValue />
        <TextField<Project> source='createdAt' label='Created at' />
        <SourceField<Project>
          source='createdBy'
          reference={constants.R_USERS}
        />
      </DatagridConfigurable>
    </List>
  )
}
