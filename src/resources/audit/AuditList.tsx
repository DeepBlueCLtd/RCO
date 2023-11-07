import { Chip } from '@mui/material'
import React, { useEffect } from 'react'
import {
  List,
  TextField,
  DateField,
  DateTimeInput,
  useListContext,
  AutocompleteArrayInput,
  TextInput,
  FunctionField,
  DatagridConfigurable,
  type DatagridConfigurableProps,
  FilterButton,
  ExportButton,
  useGetList
} from 'react-admin'
import * as constants from '../../constants'
import ActivityTypes from '../../utils/activity-types'
import DateFilter from '../../components/DateFilter'
import SourceField from '../../components/SourceField'
import SourceInput from '../../components/SourceInput'
import StyledTopToolbar from '../../components/StyledTopToolbar'
import { useLocation } from 'react-router-dom'

interface Props {
  label: string
  source: string
}

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
  <TextInput source='resource' key='resource' label='Resource' />,
  <TextInput source='item' key='Item' />,
  <SecurityRelatedFilter
    source='securityRelated'
    key='securityRelated'
    label='Security Related'
  />,
  <DateFilter key='createdAt' source='dateTime' label='Created At' />,
  <SourceInput key='subject' source='subjectId' reference={constants.R_USERS} />
]

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
      <ExportButton />
    </StyledTopToolbar>
  )
}

interface ItemProps {
  record: Item
}

export const ItemName = ({ record }: ItemProps): React.ReactElement => {
  const { data: richItemRecord } = useGetList<RichItem>(
    constants.R_RICH_ITEMS,
    {
      filter: { id: record.id },
      pagination: { page: 1, perPage: 1 }
    }
  )

  return (
    <>
      {richItemRecord?.[0]?.vault ? `${richItemRecord?.[0]?.vault?.[0]}` : ''}
      {richItemRecord?.[0]?.itemNumber}
    </>
  )
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
        {...(data !== undefined ? { data } : null)}
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
        <DateField<Audit> source='dateTime' label='Date Time' showTime />;
        <TextField<Audit> source='label' label='Activity Type' />
        <TextField<Audit>
          source='activityDetail'
          label='Activity Details'
          sx={{ wordBreak: 'break-all', display: 'inline-block' }}
        />
        <TextField<Audit> source='securityRelated' label='Security Related' />
        <TextField<Audit> source='resource' label='Resource' />
        {!omit.includes('dataId') && (
          <FunctionField<Audit>
            label='Name'
            render={(record) => {
              return (
                <>
                  {record.resource !== null ? (
                    record.resource !== constants.R_ITEMS ? (
                      <SourceField<Audit>
                        source='dataId'
                        reference={record.resource}
                        sourceField={resourcesRefKey[record.resource]}
                        link={() => {
                          if (
                            record.resource &&
                            referenceItems.includes(record.resource)
                          ) {
                            return `/${record.resource}/${record.dataId}/show`
                          }
                          if (record.resource === constants.R_ITEMS) {
                            return `/${constants.R_RICH_ITEMS}/${record.dataId}/show`
                          }
                          return 'show'
                        }}
                      />
                    ) : (
                      <FunctionField<RichItem>
                        render={(record) => <ItemName record={record} />}
                      />
                    )
                  ) : (
                    <TextField<Audit> source='dataId' label='Item' />
                  )}
                </>
              )
            }}
          />
        )}
        {/* Note: the following function is flexible, so it is able to show
        source value for different kinds of resource */}
        {!omit.includes('subjectId') && (
          <FunctionField<Audit>
            label='Subject Item'
            render={(record) => {
              return (
                <>
                  {record.subjectId !== null &&
                    record.subjectResource !== null && (
                      <SourceField<Audit>
                        source='subjectId'
                        reference={record.subjectResource}
                        sourceField={resourcesRefKey[record.subjectResource]}
                        link={() => {
                          if (
                            record.subjectResource &&
                            record.subjectResource !== null &&
                            referenceItems.includes(record.subjectResource)
                          ) {
                            return `/${record.subjectResource}/${record.subjectId}/show`
                          }
                          if (record.subjectResource === constants.R_ITEMS) {
                            return `/${constants.R_RICH_ITEMS}/${record.subjectId}/show`
                          }
                          return 'show'
                        }}
                      />
                    )}
                </>
              )
            }}
          />
        )}
        <TextField<Audit> source='ip' label='IP Address' />
      </DatagridConfigurable>
    </List>
  )
}
