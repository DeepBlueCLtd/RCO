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
  useGetMany,
  DateField,
  type SortPayload
} from 'react-admin'
import CreatedByMeFilter from '../../components/CreatedByMeFilter'
import DateFilter, { ResetDateFilter } from '../../components/DateFilter'
import DatePicker from '../../components/DatePicker'
import SourceField from '../../components/SourceField'
import SourceInput from '../../components/SourceInput'
import * as constants from '../../constants'
import useCanAccess from '../../hooks/useCanAccess'
import { useConfigData } from '../../utils/useConfigData'

const ListActions = (): React.ReactElement => {
  const { hasAccess } = useCanAccess()
  return (
    <TopToolbar>
      {hasAccess(constants.R_BATCHES, { write: true }) ? (
        <CreateButton label='ADD NEW BATCH' />
      ) : null}
      <FilterButton />
      <SelectColumnsButton />
    </TopToolbar>
  )
}

const omitColumns: string[] = [
  'protectiveMarking',
  'department',
  'remarks',
  'id',
  'receiptNotes',
  'createdAt'
]

const sort = (field = 'name'): SortPayload => ({ field, order: 'ASC' })

interface PlatformFilterType {
  label: string
  reference: string
  source: string
}

const PlatformFilter = (props: PlatformFilterType): React.ReactElement => {
  const { data: batches } = useGetList('batches')
  const platformIds = batches?.map((batch) => batch.platform) ?? []
  const { label, reference } = props
  const { setFilters, displayedFilters } = useListContext()
  const { data } = useGetMany(reference, { ids: platformIds })
  useEffect(() => {
    if (data != null) {
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

export default function BatchList(): React.ReactElement {
  const configData = useConfigData()

  const filters = [
    <SourceInput key='vault' source='vault' reference={constants.R_VAULT} />,
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
      reference={constants.R_PLATFORMS}
      key='platform'
      sort={sort()}
      source='platform_eq'
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
      key={constants.R_ORGANISATION}
    />,
    <SourceInput
      variant='outlined'
      reference={constants.R_PROJECTS}
      source='project'
      label={configData?.projectName}
      key={configData?.projectsName}
    />,
    <DateFilter key='createdAt' source='createdAt' label='Created At' />
  ]

  return (
    <List perPage={25} actions={<ListActions />} filters={filters}>
      <ResetDateFilter source='createdAt' />
      <DatagridConfigurable
        omit={omitColumns}
        rowClick='show'
        bulkActionButtons={false}>
        <TextField source='id' />
        <DateField source='startDate' />
        <DateField source='endDate' />
        <TextField label='Reference' source='batchNumber' />
        <SourceField source='department' label='Department' />
        <SourceField
          source='project'
          reference={constants.R_PROJECTS}
          label={configData?.projectName}
        />
        <SourceField
          source='platform'
          reference={constants.R_PLATFORMS}
          label='Platform'
        />
        <SourceField source='organisation' label='Organisation' />
        <SourceField
          source='protectiveMarking'
          reference={constants.R_PROTECTIVE_MARKING}
          label='Maximum protective marking'
        />
        <SourceField source='vault' reference={constants.R_VAULT} />
        <TextField source='remarks' />
        <TextField source='receiptNotes' />
        <TextField source='createdAt' label='Created' />
        <TextField source='protectionString' label='Protection' />
      </DatagridConfigurable>
    </List>
  )
}
