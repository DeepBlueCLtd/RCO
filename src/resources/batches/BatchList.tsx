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
  'remarks',
  'id'
]

const sort = (field = 'name') => ({ field, order: 'ASC' })

const filters = [
  <SearchInput source='q' key='q' alwaysOn />,
  <DatePicker
    label='Year of receipt'
    source='yearOfReceipt'
    variant='outlined'
    format='YYYY'
    key='yearOfReceipt'
    dataPickerProps={{ views: ['year'] }}
  />,
  <SourceInput
    source={constants.R_VAULT_LOCATION}
    key='vaultLocation'
    sort={sort()}
    reference='vaultLocation'
  />,
  <SourceInput
    source={constants.R_PLATFORMS}
    key='platforms'
    sort={sort()}
    reference='platforms'
  />,
  <SourceInput
    variant='outlined'
    source={constants.R_ORGANISATION}
    reference='organisation'
    key='organisation'
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
          source='protectiveMarkingAuthority'
          reference='protectiveMarkingAuthority'
          label='Protective marking authorityg'
        />
        <SourceField
          source='maximumProtectiveMarking'
          reference='protectiveMarking'
          label='Maximum protective marking'
        />
        <TextField source='remarks' />
      </DatagridConfigurable>
    </List>
  )
}
