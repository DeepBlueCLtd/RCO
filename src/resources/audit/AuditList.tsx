import { Chip } from '@mui/material'
import React, { useEffect } from 'react'
import {
  Datagrid,
  List,
  TextField,
  DateField,
  DateTimeInput,
  NumberInput,
  useListContext,
  AutocompleteArrayInput,
  TextInput,
  FunctionField
} from 'react-admin'
import * as constants from '../../constants'
import ActivityTypes from '../../utils/activity-types'
import DateFilter from '../../components/DateFilter'
import SourceField from '../../components/SourceField'
import SourceInput from '../../components/SourceInput'

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
  [constants.R_ITEMS]: 'item_number',
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
}

const referenceItems = [
  constants.R_PLATFORMS,
  constants.R_VAULT_LOCATION,
  constants.R_PROTECTIVE_MARKING,
  constants.R_ORGANISATION,
  constants.R_PLATFORM_ORIGINATOR,
  constants.R_MEDIA_TYPE,
  constants.R_DEPARTMENT
]

interface AuditListProps {
  filter?: FilterType
  data?: Audit[]
}
export default function AuditList({
  filter = undefined,
  data = undefined
}: AuditListProps): React.ReactElement {
  return (
    <List
      perPage={25}
      resource='audit'
      sort={{
        field: 'dateTime',
        order: 'DESC'
      }}
      filters={filters}
      filter={filter}>
      <Datagrid
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
        <SourceField
          source='subject'
          reference={constants.R_USERS}
          link='show'
        />
      </Datagrid>
    </List>
  )
}
