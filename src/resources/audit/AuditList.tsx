import { Chip } from '@mui/material'
import React, { useEffect } from 'react'
import {
  Datagrid,
  List,
  TextField,
  ReferenceField,
  DateField,
  DateTimeInput,
  NumberInput,
  useListContext,
  AutocompleteInput
} from 'react-admin'
import * as constants from '../../constants'
import ActivityTypes from '../../utils/activity-types'

interface Props {
  label: string
  source: string
}

const SecurityRelatedFilter = ({ label, source }: Props) => {
  const { setFilters, displayedFilters, filterValues } = useListContext()

  useEffect(() => {
    setFilters({ ...filterValues, [source]: true }, displayedFilters)
  }, [])

  return <Chip sx={{ marginBottom: 1 }} label={label} />
}

const choices = ActivityTypes.map((v) => ({ name: v.label, id: v.label }))
const filters = [
  <DateTimeInput
    key='start'
    source='dateTime_gte'
    label='After'
    alwaysOn={true}
  />,
  <DateTimeInput key='end' source='dateTime_lte' label='Before' />,
  <AutocompleteInput
    source='label'
    choices={choices}
    key='Activity Type'
    label='Activity Type'
  />,
  <NumberInput source='user_id' key='user' label='User' min={1} max={2} />,
  <SecurityRelatedFilter
    source='securityRelated'
    key='securityRelated'
    label='Security Related'
  />
]

export default function AuditList(): React.ReactElement {
  return (
    <List
      perPage={25}
      sort={{
        field: 'dateTime',
        order: 'DESC'
      }}
      filters={filters}>
      <Datagrid bulkActionButtons={false}>
        <ReferenceField source='user_id' reference={constants.R_USERS} />
        <DateField source='dateTime' label='Date Time' showTime />;
        <TextField source='label' label='Activity Type' />
        <TextField source='activityDetail' label='Activity Details' />
        <TextField source='securityRelated' label='Security Related' />
      </Datagrid>
    </List>
  )
}
