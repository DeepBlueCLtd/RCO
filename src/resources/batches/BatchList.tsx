import React from 'react'
import {
  List,
  TextField,
  DatagridConfigurable,
  TopToolbar,
  SelectColumnsButton,
  CreateButton,
  SearchInput,
  FilterButton
} from 'react-admin'
import DateFilter, { ResetDateFilter } from '../../components/DateFilter'
import DatePicker from '../../components/DatePicker'
import SourceField from '../../components/SourceField'
import SourceInput from '../../components/SourceInput'
import * as constants from '../../constants'

const ListActions = () => (
  <TopToolbar>
    <CreateButton label='ADD NEW BATCH' />
    <FilterButton />
    <SelectColumnsButton />
  </TopToolbar>
)

const omitColumns: string[] = [
  'protectiveMarkingAuthority',
  'maximumProtectiveMarking',
  'department',
  'remarks',
  'id',
  'receiptNotes'
]

const sort = (field = 'name') => ({ field, order: 'ASC' })

const filters = [
  <SearchInput source='q' key='q' alwaysOn />,
  <SourceInput
    key='createdBy'
    source='createdBy'
    reference={constants.R_USERS}
  />,
  <DatePicker
    label='Year of receipt'
    source='yearOfReceipt'
    variant='outlined'
    format='YYYY'
    key='yearOfReceipt'
    dataPickerProps={{ views: ['year'] }}
  />,
  <SourceInput
    reference={constants.R_VAULT_LOCATION}
    key='vaultLocation'
    sort={sort()}
    source='vaultLocation'
  />,
  <SourceInput
    source='platform'
    key='platforms'
    sort={sort()}
    reference={constants.R_PLATFORMS}
  />,
  <SourceInput
    variant='outlined'
    reference={constants.R_ORGANISATION}
    source='organisation'
    key='organisation'
  />,
  <SourceInput
    variant='outlined'
    reference={constants.R_PROJECTS}
    source='project'
    key='projects'
  />,
  <DateFilter key='createdAt' source='createdAt' label='Created At' />
]

export default function BatchList(): React.ReactElement {
  return (
    <List perPage={25} actions={<ListActions />} filters={filters}>
      <ResetDateFilter source='createdAt' />
      <DatagridConfigurable omit={omitColumns} rowClick='show'>
        <TextField source='id' />
        <TextField label='Reference' source='batchNumber' />
        <SourceField source='department' label='Department' />
        <SourceField
          source='project'
          reference={constants.R_PROJECTS}
          label='Project'
        />
        <SourceField
          source='platform'
          reference={constants.R_PLATFORMS}
          label='Platform'
        />
        <SourceField source='organisation' label='Organisation' />
        <SourceField
          source='maximumProtectiveMarking'
          reference='protectiveMarking'
          label='Maximum protective marking'
        />
        <TextField source='remarks' />
        <TextField source='receiptNotes' />
      </DatagridConfigurable>
    </List>
  )
}
