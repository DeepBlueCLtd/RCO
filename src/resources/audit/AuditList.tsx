import { Chip } from '@mui/material'
import React, { useEffect } from 'react'
import {
  List,
  TextField,
  DateField,
  DateTimeInput,
  useListContext,
  AutocompleteArrayInput,
  FunctionField,
  DatagridConfigurable,
  type DatagridConfigurableProps,
  FilterButton,
  useGetList,
  Link,
  BooleanField,
  NumberInput,
  SelectInput
} from 'react-admin'
import * as constants from '../../constants'
import ActivityTypes from '../../utils/activity-types'
import DateFilter from '../../components/DateFilter'
import SourceField from '../../components/SourceField'
import SourceInput from '../../components/SourceInput'
import StyledTopToolbar from '../../components/StyledTopToolbar'
import { useLocation } from 'react-router-dom'
import { useConfigData } from '../../utils/useConfigData'

interface Props {
  label: string
  source: string
}
export const availableResources = [
  constants.R_USERS,
  constants.R_ITEMS,
  constants.R_BATCHES,
  constants.R_DESTRUCTION,
  constants.R_VAULT_LOCATION,
  constants.R_DISPATCH,
  constants.R_PROJECTS,
  constants.R_MEDIA_TYPE,
  constants.R_PLATFORMS,
  constants.R_ORGANISATION,
  constants.R_CAT_CAVE,
  constants.R_CAT_CODE,
  constants.R_CAT_HANDLE,
  constants.R_DEPARTMENT,
  constants.R_PROTECTIVE_MARKING
]

const SecurityRelatedFilter = ({
  label,
  source
}: Props): React.ReactElement => {
  const { setFilters, displayedFilters, filterValues } = useListContext()

  useEffect(() => {
    setFilters({ ...filterValues, [source]: true }, displayedFilters)
  }, [])

  return <Chip sx={{ marginBottom: 1 }} label={label} />
}
const choices = ActivityTypes.map((v) => ({ name: v.label, id: v.label }))
const resourcesRefKey: Record<string, string> = {
  [constants.R_BATCHES]: 'batchNumber',
  [constants.R_ITEMS]: 'itemNumber',
  [constants.R_DESTRUCTION]: 'name',
  [constants.R_DISPATCH]: 'name',
  [constants.R_ADDRESSES]: 'id',
  [constants.R_PROJECTS]: 'name',
  [constants.R_PLATFORMS]: 'name',
  [constants.R_USERS]: 'name'
}

export interface FilterType {
  dataId?: number
  user?: number
  resource?: string
  activityType?: string | string[]
}

const referenceItems = [
  constants.R_PLATFORMS,
  constants.R_VAULT_LOCATION,
  constants.R_PROTECTIVE_MARKING,
  constants.R_ORGANISATION,
  constants.R_MEDIA_TYPE,
  constants.R_DEPARTMENT
]

interface ListActionsProps {
  buttons?: React.ReactElement
}

export const ListActions = (props: ListActionsProps): React.ReactElement => {
  const { buttons = <></> } = props
  return (
    <StyledTopToolbar>
      {buttons}
      <FilterButton />
    </StyledTopToolbar>
  )
}

interface AuditProps {
  id: number | string | null
}

export const BatchName = ({ id }: AuditProps): React.ReactElement => {
  const { data: batch } = useGetList<Batch>(constants.R_BATCHES, {
    filter: { id },
    pagination: { page: 1, perPage: 1 }
  })
  return (
    <Link to={`/${constants.R_BATCHES}/${id}/show`}>
      {batch?.[0]?.vault ? `${batch?.[0]?.vault?.[0]}` : ''}
      {batch?.[0]?.batchNumber}
    </Link>
  )
}

export const ItemName = ({ id }: AuditProps): React.ReactElement => {
  const { data: richItemRecord } = useGetList<RichItem>(
    constants.R_RICH_ITEMS,
    {
      filter: { id },
      pagination: { page: 1, perPage: 1 }
    }
  )
  return (
    <Link to={`/${constants.R_RICH_ITEMS}/${id}/show`}>
      {richItemRecord?.[0]?.vault ? `${richItemRecord?.[0]?.vault?.[0]}` : ''}
      {richItemRecord?.[0]?.itemNumber}
    </Link>
  )
}

const renderLabel = (
  id: number | string | null,
  resource: string | null,
  idField: string
): React.ReactElement => {
  if (resource) {
    switch (resource) {
      case constants.R_ITEMS:
        return <FunctionField<Audit> render={() => <ItemName id={id} />} />
      case constants.R_BATCHES:
        return <FunctionField<Audit> render={() => <BatchName id={id} />} />
      default:
        return (
          <SourceField<Audit>
            source={idField as keyof Audit}
            reference={resource}
            sourceField={resourcesRefKey[resource]}
            link={() => {
              if (referenceItems.includes(resource)) {
                return `/${resource}/${id}/show`
              }
              return 'show'
            }}
          />
        )
    }
  } else {
    return <div></div>
  }
}

interface AuditListProps extends DatagridConfigurableProps {
  filter?: FilterType
  data?: Audit[]
  actions?: React.ReactElement
}
export default function AuditList({
  filter = undefined,
  data = undefined,
  omit = [],
  actions
}: AuditListProps): React.ReactElement {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const storeKey = searchParams.get('filter')
    ? 'filtered-audit-list'
    : 'simple-audit-list'
  const filteredData = location.state?.filter

  const ConfigData = useConfigData()
  const labelledResources = availableResources.map((resource) => ({
    id: resource,
    name:
      resource === constants.R_PROJECTS
        ? ConfigData?.projectName
        : constants.cosmeticLabels[
            resource as keyof typeof constants.cosmeticLabels
          ]
  }))

  const filters = [
    <DateTimeInput
      key='startDate'
      source='dateTime_gte'
      label='After'
      alwaysOn={true}
    />,
    <DateTimeInput key='endDate' source='dateTime_lte' label='Before' />,
    <AutocompleteArrayInput
      source='label'
      choices={choices}
      key='Activity Type'
      label='Activity Type'
    />,
    <SourceInput
      reference={constants.R_USERS}
      source='user'
      key='user'
      label='User'
    />,
    <SelectInput
      choices={labelledResources}
      source='resource'
      key='resource'
      label='Resource'
    />,

    <SecurityRelatedFilter
      source='securityRelated'
      key='securityRelated'
      label='Security Related'
    />,
    <DateFilter key='createdAt' source='dateTime' label='Created At' />,
    <NumberInput
      key='data'
      source='dataId'
      label='Subject (expert users only)'
    />,
    <NumberInput
      key='subject'
      source='subjectId'
      label='Object (expert users only)'
    />
  ]
  const renderResource = (record: Audit): string => {
    const resourceName = labelledResources.find(
      (r) => r.id === record.resource
    )?.name
    return String(resourceName ?? record.resource)
  }
  return (
    <List
      perPage={25}
      resource={constants.R_AUDIT}
      sort={{
        field: 'dateTime',
        order: 'DESC'
      }}
      filters={filters}
      filter={filter}
      storeKey={storeKey}
      actions={actions ?? <ListActions />}>
      <DatagridConfigurable
        omit={omit}
        {...(data !== undefined
          ? { data }
          : filteredData !== undefined
          ? { data: filteredData }
          : null)}
        bulkActionButtons={false}
        sx={{
          '&  .RaDatagrid-rowCell': {
            maxWidth: '600px',
            padding: '12px'
          }
        }}>
        <SourceField<Audit>
          source='user'
          reference={constants.R_USERS}
          link='show'
        />
        <DateField<Audit> source='dateTime' label='Date Time' showTime />
        <TextField<Audit> source='label' label='Activity Type' />
        <TextField<Audit>
          source='activityDetail'
          label='Activity Details'
          sx={{ wordBreak: 'break-all', display: 'inline-block' }}
        />
        <BooleanField<Audit>
          source='securityRelated'
          label='Security Related'
          looseValue
        />

        <FunctionField<Audit>
          source='resource'
          label='Resource'
          render={renderResource}
        />
        {!omit.includes('dataId') && (
          <FunctionField<Audit>
            label='Subject '
            render={(record) => {
              return (
                record.dataId &&
                renderLabel(record.dataId, record.resource, 'dataId')
              )
            }}
          />
        )}
        {/* Note: the following function is flexible, so it is able to show
        source value for different kinds of resource */}
        {!omit.includes('subjectId') && (
          <FunctionField<Audit>
            label='Object'
            render={(record) => {
              return (
                record.subjectId &&
                renderLabel(
                  record.subjectId,
                  record.subjectResource,
                  'subjectId'
                )
              )
            }}
          />
        )}
        <TextField<Audit> source='ip' label='IP Address' />
      </DatagridConfigurable>
    </List>
  )
}
