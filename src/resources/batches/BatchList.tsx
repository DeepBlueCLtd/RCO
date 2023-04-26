import { Chip } from '@mui/material'
import React, { useEffect } from 'react'
import {
  List,
  TextField,
  DatagridConfigurable,
  TopToolbar,
  SelectColumnsButton,
  CreateButton,
  SearchInput,
  FilterButton,
  useListContext,
  useGetList,
  useGetMany
} from 'react-admin'
import CreatedByMeFilter from '../../components/CreatedByMeFilter'
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
  'receiptNotes',
  'createdAt'
]

const sort = (field = 'name') => ({ field, order: 'ASC' })

interface PlatformFilterType {
  label: string
  reference: string
  source: string
  filter?: string
}

const PlatformFilter = (props: PlatformFilterType) => {
  const { data: batches } = useGetList('batches')
  const platformIds = batches?.map((batch) => batch.platform) ?? []
  const { label, reference, filter = 'active' } = props
  const { setFilters, displayedFilters } = useListContext()
  const { data } = useGetMany(reference, { ids: platformIds })
  useEffect(() => {
    if ((data != null) && filter === 'active') {
      const filteredData = data.filter((d) => d.active === true)
      setFilters(
        {
          ...displayedFilters,
          platform: filteredData.map((d) => d.id)
        },
        displayedFilters
      )
    }
  }, [data])

  return <Chip sx={{ marginBottom: '9px' }} label={label} />
}

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
  <PlatformFilter
    reference={constants.R_PLATFORMS}
    label='Active Platforms'
    key='activePlatforms'
    source='platform'
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
        <TextField source='createdAt' label='Created' />
      </DatagridConfigurable>
    </List>
  )
}
