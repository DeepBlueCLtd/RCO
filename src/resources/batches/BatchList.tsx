import { Chip } from '@mui/material'
import React, { useEffect, useState } from 'react'
import {
  List,
  TextField,
  DatagridConfigurable,
  SelectColumnsButton,
  CreateButton,
  SearchInput,
  FilterButton,
  useListContext,
  useGetList,
  useGetMany,
  type SortPayload,
  type SelectColumnsButtonProps,
  FunctionField
} from 'react-admin'
import CreatedByMeFilter from '../../components/CreatedByMeFilter'
import DateFilter, { ResetDateFilter } from '../../components/DateFilter'
import DatePicker from '../../components/DatePicker'
import SourceField from '../../components/SourceField'
import SourceInput from '../../components/SourceInput'
import * as constants from '../../constants'
import useCanAccess from '../../hooks/useCanAccess'
import { useConfigData } from '../../utils/useConfigData'
import StyledTopToolbar from '../../components/StyledTopToolbar'

const ListActions = ({
  preferenceKey
}: SelectColumnsButtonProps): React.ReactElement => {
  const { hasAccess } = useCanAccess()

  return (
    <StyledTopToolbar>
      {hasAccess(constants.R_BATCHES, { write: true }) ? (
        <CreateButton label='ADD NEW BATCH' />
      ) : (
        <></>
      )}
      <FilterButton />
      <SelectColumnsButton preferenceKey={preferenceKey} />
    </StyledTopToolbar>
  )
}

const omitColumns: string[] = [
  'department',
  'remarks',
  'id',
  'receiptNotes',
  'createdAt',
  'createdBy'
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
  const [projectName, setProjectName] = useState<null | string>()
  const preferenceKey = `${constants.R_BATCHES}-batch-datagrid-columns`
  const [key, setKey] = useState(0)

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
      key={configData?.projectsName}
      inputProps={{ label: configData?.projectName }}
    />,
    <DateFilter
      key='createdAt'
      source='createdAt'
      label='Created At'
      format='iso'
    />
  ]
  useEffect(() => {
    if (configData?.projectName) {
      setProjectName(configData.projectName)
      setKey((prev) => prev + 1)
    }
  }, [configData?.projectName])

  return (
    <List
      key={key}
      sx={{
        '& .MuiToolbar-root': {
          '& > form': {
            flex: 1
          }
        }
      }}
      perPage={25}
      actions={<ListActions preferenceKey={preferenceKey} />}
      filters={filters}>
      <ResetDateFilter source='createdAt' />
      <DatagridConfigurable
        omit={omitColumns}
        rowClick='show'
        bulkActionButtons={false}
        preferenceKey={preferenceKey}>
        <TextField<Batch> source='id' />
        <FunctionField<Batch>
          label='Reference'
          render={(record) => `${record.vault?.[0]}${record?.batchNumber}`}
        />
        <SourceField<Batch>
          source='department'
          label='Department'
          reference={constants.R_DEPARTMENT}
        />

        {projectName && (
          <SourceField<Batch>
            source='project'
            reference={constants.R_PROJECTS}
            label={projectName}
          />
        )}

        <SourceField<Batch>
          source='platform'
          reference={constants.R_PLATFORMS}
          label='Platform'
        />
        <SourceField<Batch>
          source='organisation'
          label='Organisation'
          reference={constants.R_ORGANISATION}
        />
        <SourceField<Batch> source='vault' reference={constants.R_VAULT} />
        <TextField<Batch> source='remarks' />
        <TextField<Batch> source='receiptNotes' />
        <TextField<Batch> source='createdAt' label='Created At' />
        <SourceField<Batch> source='createdBy' reference={constants.R_USERS} />
      </DatagridConfigurable>
    </List>
  )
}
