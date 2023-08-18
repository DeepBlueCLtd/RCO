import { Chip } from '@mui/material'
import React, { useEffect } from 'react'
import {
  List,
  TextField,
  DateField,
  DateTimeInput,
  NumberInput,
  useListContext,
  AutocompleteArrayInput,
  TextInput,
  FunctionField,
  DatagridConfigurable,
  type DatagridConfigurableProps,
  FilterButton,
  ExportButton
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
  <NumberInput source='user' key='user' label='User' min={1} max={2} />,
  <TextInput source='resource' key='resource' label='Resource' />,
  <TextInput source='item' key='Item' />,
  <SecurityRelatedFilter
    source='securityRelated'
    key='securityRelated'
    label='Security Related'
  />,
  <DateFilter key='createdAt' source='dateTime' label='Created At' />,
  <SourceInput key='subject' source='subject' reference={constants.R_USERS} />
]

const resourcesRefKey: Record<string, string> = {
  [constants.R_BATCHES]: 'batchNumber',
  [constants.R_ITEMS]: 'itemNumber',
  [constants.R_DESTRUCTION]: 'reference',
  [constants.R_DISPATCH]: 'reference',
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
        <SourceField source='user' reference={constants.R_USERS} link='show' />
        <DateField source='dateTime' label='Date Time' showTime />;
        <TextField source='label' label='Activity Type' />
        <TextField
          source='activityDetail'
          label='Activity Details'
          sx={{ wordBreak: 'break-all', display: 'inline-block' }}
        />
        <TextField source='securityRelated' label='Security Related' />
        <TextField source='resource' label='Resource' />
        {!omit.includes('dataId') && (
          <FunctionField
            label='Name'
            render={(record: Audit) => {
              return (
                <>
                  {record.resource !== null ? (
                    <SourceField
                      source='dataId'
                      reference={record.resource}
                      sourceField={resourcesRefKey[record.resource]}
                      link={(record) => {
                        if (referenceItems.includes(record.resource)) {
                          return `/${record.resource}/${record.dataId}/show`
                        }
                        return 'show'
                      }}
                    />
                  ) : (
                    <TextField source='dataId' label='Item' />
                  )}
                </>
              )
            }}
          />
        )}
        <FunctionField
          label='Subject'
          render={(record: Audit) => {
            return (
              <SourceField
                source='subjectId'
                {...(record.subjectResource === constants.R_ITEMS
                  ? { sourceField: 'itemNumber' }
                  : null)}
                reference={record.subjectResource ?? undefined}
                link='show'
              />
            )
          }}
        />
      </DatagridConfigurable>
    </List>
  )
}
